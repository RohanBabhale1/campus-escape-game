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
          onClick={async () => {
            try {
              const { gameAPI, roomAPI } = await import("../../services/api");
              await gameAPI.restartSession();
              const sessionRes = await gameAPI.getOrCreateSession();
              const roomsRes = await roomAPI.getRooms();
              const store = useGameStore.getState();
              store.setSession(sessionRes.data.session.id);
              store.setRooms(roomsRes.data.rooms);
              store.updateInventory([]);
              store.resetPuzzleStates();
              store.setGameCompleted(false);
              store.setActiveScene('lobby');
              setPaused(false);
            } catch (e) {
              console.error("Failed to restart backend session, resetting local", e);
              const store = useGameStore.getState();
              store.setGameCompleted(false);
              store.setRooms(store.rooms.map(r => ({ ...r, is_completed: false, is_unlocked: r.order_index === 1 })));
              store.updateInventory([]);
              store.resetPuzzleStates();
              store.setActiveScene('lobby');
              setPaused(false);
            }
          }}
          className="btn-neon-cyan w-full"
          style={{ borderColor: "#FF6B00", color: "#FF6B00" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FF6B00";
            e.currentTarget.style.color = "#000";
            e.currentTarget.style.boxShadow = "0 0 10px #FF6B00";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#FF6B00";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          RESTART GAME
        </button>
        <button
          onClick={() => {
            setPaused(false);
            useGameStore.getState().setSpawnNode('eblock');
            navigate("/");
          }}
          className="btn-neon-yellow w-full"
        >
          CAMPUS HUB
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
