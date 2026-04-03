import { useEffect, useRef } from "react";

const KEYS = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
  KeyE: "interact",
  Escape: "pause",
  ShiftLeft: "sprint",
};

export function useKeyboard() {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    interact: false,
    pause: false,
    sprint: false,
  });

  useEffect(() => {
    const onDown = (e) => {
      const action = KEYS[e.code];
      if (action) keys.current[action] = true;
    };
    const onUp = (e) => {
      const action = KEYS[e.code];
      if (action) keys.current[action] = false;
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return keys;
}
