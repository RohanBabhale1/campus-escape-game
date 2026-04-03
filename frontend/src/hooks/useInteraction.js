import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import useGameStore from "../store/useGameStore";

export function useInteraction(
  objectPosition,
  label,
  onInteract,
  distance = 3.5,
) {
  const setInteractionTarget = useGameStore((s) => s.setInteractionTarget);
  const isNear = useRef(false);

  useEffect(() => {
    return () => setInteractionTarget(null);
  }, [setInteractionTarget]);

  const check = (cameraPosition) => {
    const objPos = new Vector3(...objectPosition);
    const dist = cameraPosition.distanceTo(objPos);
    const near = dist < distance;
    if (near !== isNear.current) {
      isNear.current = near;
      setInteractionTarget(near ? { label } : null);
    }
    return near;
  };

  return { check, isNear };
}
