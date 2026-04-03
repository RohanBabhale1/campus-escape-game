import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import RoomDoor from "./RoomDoor";

const ROOMS = [
  {
    slug: "technosys",
    name: "TECHNOSYS",
    color: "#00FFFF",
    pos: [-12, 0, 0],
    rot: [0, Math.PI / 2, 0],
  },
  {
    slug: "velocity",
    name: "VELOCITY",
    color: "#FF6B00",
    pos: [-8, 0, -10],
    rot: [0, Math.PI / 4, 0],
  },
  {
    slug: "return0",
    name: "RETURN 0",
    color: "#00FF41",
    pos: [0, 0, -14],
    rot: [0, 0, 0],
  },
  {
    slug: "iris",
    name: "IRIS",
    color: "#FF0080",
    pos: [8, 0, -10],
    rot: [0, -Math.PI / 4, 0],
  },
  {
    slug: "inquizitive",
    name: "INQUIZITIVE",
    color: "#FFD700",
    pos: [12, 0, 0],
    rot: [0, -Math.PI / 2, 0],
  },
  {
    slug: "ecell",
    name: "E-CELL",
    color: "#9B59B6",
    pos: [8, 0, 10],
    rot: [0, -Math.PI * 0.75, 0],
  },
  {
    slug: "hertz440",
    name: "440 HERTZ",
    color: "#FF69B4",
    pos: [0, 0, 14],
    rot: [0, Math.PI, 0],
  },
  {
    slug: "dynamight",
    name: "DYNAMIGHT",
    color: "#FF4500",
    pos: [-8, 0, 10],
    rot: [0, Math.PI * 0.75, 0],
  },
];

export default function Lobby() {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid">
        <CheckerFloor size={60} />
      </RigidBody>

      <mesh position={[0, 20, 0]} receiveShadow>
        <boxGeometry args={[60, 0.5, 60]} />
        <meshStandardMaterial color="#0a0a1a" />
      </mesh>

      <RigidBody type="fixed" colliders="cuboid">
        <WallSystem />
      </RigidBody>

      <CentrePillar />
      <NeonGrid />

      {ROOMS.map((room) => (
        <RoomDoor key={room.slug} {...room} />
      ))}
    </group>
  );
}

function CheckerFloor({ size = 60 }) {
  const tiles = [];
  const tileSize = 3;
  const count = size / tileSize;

  for (let x = 0; x < count; x++) {
    for (let z = 0; z < count; z++) {
      const isLight = (x + z) % 2 === 0;
      tiles.push(
        <mesh
          key={`${x}-${z}`}
          position={[
            x * tileSize - size / 2 + tileSize / 2,
            0,
            z * tileSize - size / 2 + tileSize / 2,
          ]}
          receiveShadow
        >
          <boxGeometry args={[tileSize, 0.1, tileSize]} />
          <meshStandardMaterial
            color={isLight ? "#1a4a4a" : "#0d2626"}
            roughness={0.8}
          />
        </mesh>,
      );
    }
  }
  return <group>{tiles}</group>;
}

function WallSystem() {
  const walls = [
    { pos: [0, 10, -30], scale: [60, 20, 0.5] },
    { pos: [0, 10, 30], scale: [60, 20, 0.5] },
    { pos: [-30, 10, 0], scale: [0.5, 20, 60] },
    { pos: [30, 10, 0], scale: [0.5, 20, 60] },
  ];
  return (
    <>
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} receiveShadow>
          <boxGeometry args={w.scale} />
          <meshStandardMaterial color="#0a1a2a" roughness={1} />
        </mesh>
      ))}
    </>
  );
}

function CentrePillar() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ref} position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 10, 6]} />
        <meshStandardMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight
        position={[0, 5, 0]}
        color="#FF00FF"
        intensity={3}
        distance={20}
      />
    </group>
  );
}

function NeonGrid() {
  const lines = [];
  for (let i = -5; i <= 5; i++) {
    lines.push(
      <mesh key={`h${i}`} position={[i * 5, 19.5, 0]}>
        <boxGeometry args={[0.05, 0.05, 60]} />
        <meshStandardMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={1}
        />
      </mesh>,
      <mesh key={`v${i}`} position={[0, 19.5, i * 5]}>
        <boxGeometry args={[60, 0.05, 0.05]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={1}
        />
      </mesh>,
    );
  }
  return <group>{lines}</group>;
}
