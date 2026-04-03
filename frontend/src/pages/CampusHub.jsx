import React from "react";
import { Navigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import GameCanvas3D from "../hub/components/GameCanvas3D";
import HUD from "../hub/components/HUD";
import InteractionConsole from "../hub/components/InteractionConsole";
import Chat from "../hub/components/Chat";
import MobileJoystick from "../hub/components/MobileJoystick";

export default function CampusHub() {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const user = useGameStore((s) => s.user);
  const spawnNode = useGameStore((s) => s.spawnNode);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <HUD />
      <GameCanvas3D user={user} spawnNode={spawnNode} />
      <InteractionConsole />
      <Chat user={user} />
      <MobileJoystick />
    </div>
  );
}
