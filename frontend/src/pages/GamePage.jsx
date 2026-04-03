import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameScene from "../components/game/GameScene";
import HUD from "../components/ui/HUD";
import PauseMenu from "../components/ui/PauseMenu";
import useGameStore from "../store/useGameStore";
import { gameAPI, roomAPI, leaderboardAPI } from "../services/api";
import Confetti from "react-confetti";

export default function GamePage() {
  const navigate = useNavigate();
  const setRooms = useGameStore((s) => s.setRooms);
  const setSession = useGameStore((s) => s.setSession);
  const isPaused = useGameStore((s) => s.isPaused);
  
  const rooms = useGameStore((s) => s.rooms);
  const gameCompleted = useGameStore((s) => s.gameCompleted);

  const activeScene = useGameStore((s) => s.activeScene);

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
        // Force all rooms unlocked from the start
        setRooms(roomsRes.data.rooms.map(r => ({ ...r, is_unlocked: true })));
      } catch (err) {
        console.error("Failed to initialise game backend, using local offline mode:", err);
        setSession("local-offline-session");
        setRooms([
          { slug: "dynamight", name: "Dynamight", order_index: 1, is_unlocked: true, is_completed: false },
          { slug: "ecell", name: "E-Cell", order_index: 2, is_unlocked: true, is_completed: false },
          { slug: "hertz440", name: "Hertz 440", order_index: 3, is_unlocked: true, is_completed: false },
          { slug: "inquizitive", name: "InQuizitive", order_index: 4, is_unlocked: true, is_completed: false },
          { slug: "iris", name: "IRIS", order_index: 5, is_unlocked: true, is_completed: false },
          { slug: "return0", name: "Return 0", order_index: 6, is_unlocked: true, is_completed: false },
          { slug: "technosys", name: "Technosys", order_index: 7, is_unlocked: true, is_completed: false },
          { slug: "velocity", name: "Velocity", order_index: 8, is_unlocked: true, is_completed: false },
          { slug: "final", name: "Final Escape", order_index: 9, is_unlocked: true, is_completed: false }
        ]);
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
          setRooms(roomsRes.data.rooms.map(r => ({ ...r, is_unlocked: true })));
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
      <div className="scanlines" />
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
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} />
          
          <div className="glass-panel p-12 text-center pixel-border-magenta max-w-lg z-10">
            <h1 className="font-pixel text-pixel-xl text-neon-yellow text-glow-yellow animate-neon-pulse mb-4">
              CONGRATULATIONS!
            </h1>
            <p className="font-pixel text-pixel-xs text-neon-cyan mb-8" style={{lineHeight: 1.5}}>
              You escaped all clubs!<br/>
              Welcome, Official IIIT Dharwad Student 🎉<br/>
              <span className="text-neon-magenta text-[0.8rem] mt-2 block">Score submitted to leaderboard!</span>
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  useGameStore.getState().setSpawnNode('eblock');
                  navigate("/");
                }}
                className="btn-neon-magenta"
              >
                RETURN TO CAMPUS
              </button>
              <button
                onClick={async () => {
                  try {
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
                  } catch (e) {
                    console.error("Failed to restart backend session, resetting local", e);
                    const store = useGameStore.getState();
                    store.setGameCompleted(false);
                    store.setRooms(store.rooms.map(r => ({ ...r, is_completed: false, is_unlocked: r.order_index === 1 })));
                    store.updateInventory([]);
                    store.resetPuzzleStates();
                    store.setActiveScene('lobby');
                  }
                }}
                className="btn-neon-cyan"
              >
                RESTART GAME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
