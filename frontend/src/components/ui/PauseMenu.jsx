import React from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../../store/useGameStore";

export default function PauseMenu() {
  const navigate = useNavigate();
  const setPaused = useGameStore((s) => s.setPaused);
  const logout = useGameStore((s) => s.logout);

  return (
    <div className="w-full h-full bg-void/80 backdrop-blur-sm flex items-center justify-center">
      <div className="glass-panel p-10 rounded-sm pixel-border-magenta w-80 text-center space-y-4">
        <h2 className="font-pixel text-pixel-lg text-neon-magenta text-glow-magenta mb-6">
          PAUSED
        </h2>
        <button
          onClick={() => setPaused(false)}
          className="btn-neon-cyan w-full"
        >
          RESUME
        </button>
        <button
          onClick={() => {
            setPaused(false);
            navigate("/menu");
          }}
          className="btn-neon-yellow w-full"
        >
          MAIN MENU
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="btn-neon-magenta w-full"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}
