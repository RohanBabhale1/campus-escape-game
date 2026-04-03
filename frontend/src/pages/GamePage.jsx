import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameScene from "../components/game/GameScene";
import HUD from "../components/ui/HUD";
import PauseMenu from "../components/ui/PauseMenu";
import useGameStore from "../store/useGameStore";
import { gameAPI, roomAPI, leaderboardAPI } from "../services/api";

export default function GamePage() {
  const navigate = useNavigate();
  const {
    setRooms,
    setSession,
    isPaused,
    gameCompleted,
    sessionId,
    sessionScore,
    user,
    activeScene,
  } = useGameStore();

  // Track the previous scene so we know when we've returned to lobby
  const prevSceneRef = useRef(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const [sessionRes, roomsRes] = await Promise.all([
          gameAPI.getOrCreateSession(),
          roomAPI.getRooms(),
        ]);
        setSession(sessionRes.data.session.id);
        setRooms(roomsRes.data.rooms);
      } catch (err) {
        console.error("Failed to initialise game:", err);
        navigate("/menu");
      }
    };
    init();
  }, []);

  // ── Re-fetch rooms whenever player returns to lobby ───────────────────────
  // This is the fix: when activeScene transitions FROM a room scene BACK to
  // "lobby", we immediately re-fetch the latest room states from the backend
  // so the newly unlocked door is reflected without a manual page refresh.
  useEffect(() => {
    const wasInRoom =
      prevSceneRef.current && prevSceneRef.current.startsWith("room:");
    const nowInLobby = activeScene === "lobby";

    if (wasInRoom && nowInLobby) {
      const refreshRooms = async () => {
        try {
          const roomsRes = await roomAPI.getRooms();
          setRooms(roomsRes.data.rooms);
        } catch (err) {
          console.warn("Failed to refresh rooms:", err);
        }
      };
      refreshRooms();
    }

    prevSceneRef.current = activeScene;
  }, [activeScene, setRooms]);

  // ── Submit score when game is completed ───────────────────────────────────
  useEffect(() => {
    if (!gameCompleted) return;
    const submit = async () => {
      try {
        const sessionRes = await gameAPI.getOrCreateSession();
        const session = sessionRes.data.session;
        await leaderboardAPI.submitScore({
          score: session.score || 0,
          totalTimeSecs: session.total_time_secs || 0,
          roomsCompleted: 8,
          sessionId: session.id,
        });
      } catch (_) {}
    };
    submit();
  }, [gameCompleted]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 3-D canvas fills entire viewport */}
      <GameScene />

      {/* HUD overlays the canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <HUD />
      </div>

      {/* Pause menu */}
      {isPaused && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>
          <PauseMenu />
        </div>
      )}

      {/* Victory screen */}
      {gameCompleted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,10,15,0.92)",
          }}
        >
          <div className="glass-panel p-12 text-center pixel-border-magenta max-w-lg">
            <h1 className="font-pixel text-pixel-xl text-neon-yellow text-glow-yellow animate-neon-pulse mb-4">
              YOU ESCAPED!
            </h1>
            <p className="font-pixel text-pixel-xs text-neon-cyan mb-8">
              Score submitted to leaderboard!
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="btn-neon-magenta"
            >
              VIEW LEADERBOARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
