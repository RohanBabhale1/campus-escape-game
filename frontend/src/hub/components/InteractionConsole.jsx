import React from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../../store/useGameStore";

export default function InteractionConsole() {
  const navigate = useNavigate();
  const { canInteract, setCanInteract } = useGameStore((s) => ({
    canInteract: s.canInteract,
    setCanInteract: s.setCanInteract,
  }));

  if (!canInteract) return null;

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-blue-500 rounded-xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
          E Block Entrance
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          Welcome to the club zone! Do you want to enter the Escape Games?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={(e) => {
              if (document.activeElement) document.activeElement.blur();
              e.preventDefault();
              setCanInteract(false);
              // Route to the mini-game
              navigate("/game");
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all active:scale-95"
          >
            Enter Escape Games
          </button>
          <button
            onClick={() => setCanInteract(false)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
