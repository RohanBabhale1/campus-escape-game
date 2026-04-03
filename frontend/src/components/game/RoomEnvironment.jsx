import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import useGameStore from "../../store/useGameStore";
import { useKeyboard } from "../../hooks/useKeyboard";

const ROOM_CONFIGS = {
  technosys: { wallColor: "#001a2e", accentColor: "#00FFFF" },
  velocity: { wallColor: "#1a0d00", accentColor: "#FF6B00" },
  return0: { wallColor: "#001a00", accentColor: "#00FF41" },
  iris: { wallColor: "#1a0014", accentColor: "#FF0080" },
  inquizitive: { wallColor: "#1a1400", accentColor: "#FFD700" },
  ecell: { wallColor: "#0f0020", accentColor: "#9B59B6" },
  hertz440: { wallColor: "#1a0010", accentColor: "#FF69B4" },
  dynamight: { wallColor: "#1a0500", accentColor: "#FF4500" },
  final: { wallColor: "#0f0f0f", accentColor: "#FFFFFF" },
};

export default function RoomEnvironment() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const exitRoom = useGameStore((s) => s.exitRoom); // already clears activePuzzle
  const openPuzzle = useGameStore((s) => s.openPuzzle);

  if (!currentRoom) return null;

  const config = ROOM_CONFIGS[currentRoom.slug] || ROOM_CONFIGS.technosys;
  const { wallColor, accentColor } = config;

  return (
    <group>
      {/* ── Floor ─────────────────────────────────────────────────────────── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[20, 0.2, 20]} />
          <meshStandardMaterial
            color={accentColor}
            roughness={0.8}
            emissive={accentColor}
            emissiveIntensity={0.05}
          />
        </mesh>
      </RigidBody>

      {/* ── Ceiling ───────────────────────────────────────────────────────── */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* ── Walls — each in its own RigidBody to avoid compound AABB bug ──── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 5, -10]} receiveShadow>
          <boxGeometry args={[20, 10, 0.3]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 5, 10]} receiveShadow>
          <boxGeometry args={[20, 10, 0.3]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-10, 5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 10, 20]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[10, 5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 10, 20]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* ── Decorative neon strips ─────────────────────────────────────────── */}
      <WallAccents accentColor={accentColor} />

      {/* ── Room name ─────────────────────────────────────────────────────── */}
      <Text
        position={[0, 7.5, -9.5]}
        fontSize={0.7}
        color={accentColor}
        anchorX="center"
        maxWidth={18}
      >
        {currentRoom.name?.toUpperCase()}
      </Text>

      {/* ── Puzzle trigger ────────────────────────────────────────────────── */}
      <PuzzleTrigger
        position={[0, 1, -4]}
        color={accentColor}
        onInteract={() => openPuzzle(currentRoom.slug)}
        label="PUZZLE"
      />

      {/* ── Exit portal ───────────────────────────────────────────────────── */}
      <ExitPortal onExit={exitRoom} accentColor={accentColor} />

      {/* ── Lights ────────────────────────────────────────────────────────── */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight
        position={[0, 8, 0]}
        color={accentColor}
        intensity={3}
        distance={30}
      />
      <pointLight
        position={[-7, 4, -7]}
        color={accentColor}
        intensity={1.5}
        distance={15}
      />
      <pointLight
        position={[7, 4, 7]}
        color={accentColor}
        intensity={1.5}
        distance={15}
      />
      <pointLight
        position={[-7, 4, 7]}
        color="#ffffff"
        intensity={0.8}
        distance={15}
      />
      <pointLight
        position={[7, 4, -7]}
        color="#ffffff"
        intensity={0.8}
        distance={15}
      />
    </group>
  );
}

// ── Neon accent strips on walls ──────────────────────────────────────────────
function WallAccents({ accentColor }) {
  const strips = [
    { pos: [0, 0.15, -9.8], scale: [18, 0.1, 0.1] },
    { pos: [0, 9.8, -9.8], scale: [18, 0.1, 0.1] },
    { pos: [0, 0.15, 9.8], scale: [18, 0.1, 0.1] },
    { pos: [0, 9.8, 9.8], scale: [18, 0.1, 0.1] },
    { pos: [-9.8, 0.15, 0], scale: [0.1, 0.1, 18] },
    { pos: [-9.8, 9.8, 0], scale: [0.1, 0.1, 18] },
    { pos: [9.8, 0.15, 0], scale: [0.1, 0.1, 18] },
    { pos: [9.8, 9.8, 0], scale: [0.1, 0.1, 18] },
  ];
  return (
    <>
      {strips.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.scale} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </>
  );
}

// ── Puzzle trigger object ─────────────────────────────────────────────────────
// Uses playerPosition from store (not camera) for accurate proximity.
// Consuming keys.current.interact prevents the puzzle from opening multiple times.
function PuzzleTrigger({ position, color, onInteract, label }) {
  const groupRef = useRef();
  const keys = useKeyboard();
  const isNearRef = useRef(false);

  const playerPosition = useGameStore((s) => s.playerPosition);
  const setInteractionTarget = useGameStore((s) => s.setInteractionTarget);
  const activePuzzle = useGameStore((s) => s.activePuzzle);

  const PUZZLE_DISTANCE = 4;
  const triggerPos = useRef(new Vector3(...position));

  useEffect(() => () => setInteractionTarget(null), [setInteractionTarget]);

  useFrame((state) => {
    // Float + rotate animation
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.25;
      groupRef.current.rotation.y = state.clock.elapsedTime * 1.2;
    }

    if (activePuzzle) return; // puzzle already open — don't re-check

    const playerPos = new Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z,
    );
    const dist = playerPos.distanceTo(triggerPos.current);
    const near = dist < PUZZLE_DISTANCE;

    if (near !== isNearRef.current) {
      isNearRef.current = near;
      setInteractionTarget(near ? { label: `[E] ${label}` } : null);
    }

    if (near && keys.current.interact) {
      keys.current.interact = false; // consume so it doesn't re-fire next frame
      onInteract();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
      <pointLight color={color} intensity={3} distance={8} />
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.28}
        color={color}
        anchorX="center"
      >
        [E] {label}
      </Text>
    </group>
  );
}

// ── Exit portal ───────────────────────────────────────────────────────────────
// FIX: Q key now calls closePuzzle() before exiting, clearing any open puzzle
// overlay. Previously exiting while a puzzle was open left the overlay stuck.
function ExitPortal({ onExit, accentColor }) {
  const closePuzzle = useGameStore((s) => s.closePuzzle);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "KeyQ") {
        closePuzzle(); // ensure puzzle overlay is cleared first
        onExit(); // exitRoom() also clears activePuzzle in the store
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit, closePuzzle]);

  return (
    <group position={[0, 0, 8.5]}>
      <mesh>
        <boxGeometry args={[2.8, 3.8, 0.2]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive={accentColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      <pointLight color={accentColor} intensity={2} distance={6} />
      <Text
        position={[0, 2.8, 0.2]}
        fontSize={0.22}
        color={accentColor}
        anchorX="center"
      >
        [Q] EXIT ROOM
      </Text>
    </group>
  );
}
