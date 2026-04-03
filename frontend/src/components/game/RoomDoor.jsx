import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Vector3 } from "three";
import useGameStore from "../../store/useGameStore";
import { useKeyboard } from "../../hooks/useKeyboard";

const INTERACTION_DISTANCE = 4;

export default function RoomDoor({ slug, name, color, pos, rot }) {
  const [nearPlayer, setNearPlayer] = useState(false);
  const keys = useKeyboard();
  const doorPos = useRef(new Vector3(...pos));
  const pulseRef = useRef();

  const rooms = useGameStore((s) => s.rooms);
  const enterRoom = useGameStore((s) => s.enterRoom);
  const setInteractionTarget = useGameStore((s) => s.setInteractionTarget);
  const playerPosition = useGameStore((s) => s.playerPosition);

  const roomData = rooms.find((r) => r.slug === slug);
  const isUnlocked = roomData?.is_unlocked ?? false;
  const isCompleted = roomData?.is_completed ?? false;

  // Clear prompt when door unmounts (i.e. when player enters the room)
  useEffect(() => () => setInteractionTarget(null), [setInteractionTarget]);

  useFrame((state) => {
    // Pulse glow
    if (pulseRef.current) {
      const t = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      pulseRef.current.material.emissiveIntensity = 0.3 + t * 0.7;
    }

    // Use the real player body position, not the camera position
    const playerPos = new Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z,
    );
    const distance = playerPos.distanceTo(doorPos.current);
    const isNear = distance < INTERACTION_DISTANCE;

    if (isNear !== nearPlayer) {
      setNearPlayer(isNear);
      setInteractionTarget(
        isNear && isUnlocked && !isCompleted
          ? { label: `Enter ${name}` }
          : null,
      );
    }

    if (isNear && keys.current.interact && isUnlocked && roomData) {
      keys.current.interact = false; // consume
      enterRoom(roomData);
    }
  });

  return (
    <group position={pos} rotation={rot}>
      {/* Door frame */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 3.2, 0.2]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive={color}
          emissiveIntensity={isCompleted ? 0.1 : isUnlocked ? 0.4 : 0.05}
        />
      </mesh>

      {/* Pulsing door surface */}
      <mesh ref={pulseRef} position={[0, 0, 0.15]}>
        <boxGeometry args={[1.8, 2.8, 0.05]} />
        <meshStandardMaterial
          color={isCompleted ? "#333" : isUnlocked ? color : "#222"}
          emissive={isUnlocked ? color : "#111"}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {isUnlocked && (
        <pointLight
          position={[0, 0, 1]}
          color={color}
          intensity={2}
          distance={6}
        />
      )}

      {/* Room name */}
      <Text
        position={[0, 2, 0.3]}
        fontSize={0.2}
        color={isUnlocked ? color : "#444"}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        {name}
      </Text>

      {/* Lock / done status */}
      {!isUnlocked && (
        <Text
          position={[0, -0.5, 0.3]}
          fontSize={0.3}
          color="#FF4444"
          anchorX="center"
        >
          LOCKED
        </Text>
      )}
      {isCompleted && (
        <Text
          position={[0, -0.5, 0.3]}
          fontSize={0.3}
          color="#00FF41"
          anchorX="center"
        >
          DONE ✓
        </Text>
      )}

      {/* Proximity ring */}
      {nearPlayer && isUnlocked && !isCompleted && (
        <mesh position={[0, -1.5, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.3, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}
