import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import Lobby from "./Lobby";
import RoomEnvironment from "./RoomEnvironment";
import useGameStore from "../../store/useGameStore";
import ActivePuzzleOverlay from "../puzzles/ActivePuzzleOverlay";

export default function GameScene() {
  const activeScene = useGameStore((s) => s.activeScene);

  return (
    // ✅ FIX: outer div must be position:relative and full size so Canvas
    //    fills it, and ActivePuzzleOverlay can overlay via position:absolute.
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 5, 10] }}
        gl={{ antialias: true }}
        // ✅ FIX: explicit width/height ensures canvas never collapses
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0f",
          display: "block",
        }}
      >
        {import.meta.env.DEV && <Stats />}

        {/* Ambient lighting */}
        <ambientLight intensity={0.2} color="#1a0a2e" />
        <directionalLight position={[10, 20, 10]} intensity={0.5} castShadow />

        {/* Neon fill lights */}
        <pointLight
          position={[-10, 5, 0]}
          color="#FF00FF"
          intensity={2}
          distance={30}
        />
        <pointLight
          position={[10, 5, 0]}
          color="#00FFFF"
          intensity={2}
          distance={30}
        />
        <pointLight
          position={[0, 5, -20]}
          color="#FFFF00"
          intensity={1.5}
          distance={30}
        />

        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            {activeScene === "lobby" || activeScene === "menu" ? (
              <Lobby />
            ) : (
              <RoomEnvironment />
            )}
            <Player />
          </Physics>
        </Suspense>
      </Canvas>

      {/* ✅ Puzzle overlay sits inside this container so it covers only the canvas */}
      <ActivePuzzleOverlay />
    </div>
  );
}
