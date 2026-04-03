import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGameStore from "../store/useGameStore";
import { gameAPI, leaderboardAPI } from "../services/api";

export default function MenuPage() {
  const navigate = useNavigate();
  const { user, logout, inventory } = useGameStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState("menu");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "leaderboard") fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await leaderboardAPI.getLeaderboard({ limit: 20 });
      setLeaderboard(res.data.leaderboard);
    } catch (_) {}
    setLoading(false);
  };

  const handlePlay = async () => {
    try {
      await gameAPI.getOrCreateSession();
    } catch (_) {}
    navigate("/game");
  };

  const ROOM_SLUGS = [
    "technosys",
    "velocity",
    "return0",
    "iris",
    "inquizitive",
    "ecell",
    "hertz440",
    "dynamight",
  ];

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#FF00FF 1px,transparent 1px),linear-gradient(90deg,#FF00FF 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        <h1 className="font-pixel text-pixel-xl text-neon-magenta text-glow-magenta text-center mb-2 animate-neon-pulse">
          ESCAPE ROOM
        </h1>
        <p className="font-pixel text-pixel-xs text-neon-cyan text-center mb-8">
          COLLEGE EDITION — WELCOME, {user?.username?.toUpperCase()}
        </p>

        <div className="flex mb-6 border-b border-neon-magenta/30">
          {["menu", "leaderboard"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-pixel text-pixel-xs uppercase px-6 py-3 transition-all
                ${
                  tab === t
                    ? "text-neon-magenta border-b-2 border-neon-magenta"
                    : "text-white/40 hover:text-white/80"
                }`}
            >
              {t === "menu" ? "MENU" : "RANKS"}
            </button>
          ))}
        </div>

        {tab === "menu" && (
          <div className="glass-panel p-8 space-y-4 pixel-border-magenta">
            <div className="bg-void-light p-4 rounded-sm border border-neon-cyan/20 mb-6">
              <p className="font-pixel text-pixel-xs text-neon-cyan mb-2">
                KEYS: {inventory.length} / 8
              </p>
              <div className="flex gap-2 flex-wrap">
                {ROOM_SLUGS.map((k) => (
                  <span
                    key={k}
                    className="font-pixel text-pixel-xs px-2 py-1 rounded-sm"
                    style={{
                      background: inventory.includes(k)
                        ? "rgba(0,255,65,0.15)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${inventory.includes(k) ? "#00FF41" : "rgba(255,255,255,0.1)"}`,
                      color: inventory.includes(k) ? "#00FF41" : "#333",
                      boxShadow: inventory.includes(k)
                        ? "0 0 6px #00FF41"
                        : "none",
                    }}
                  >
                    {k.toUpperCase().slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={handlePlay} className="btn-neon-magenta w-full">
              PLAY / RESUME
            </button>
            <button
              onClick={() => setTab("leaderboard")}
              className="btn-neon-cyan w-full"
            >
              LEADERBOARD
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="btn-neon-yellow w-full"
            >
              LOGOUT
            </button>
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="glass-panel p-6 pixel-border-cyan">
            <h2 className="font-pixel text-pixel-sm text-neon-cyan text-glow-cyan mb-6 text-center">
              TOP ESCAPEES
            </h2>
            {loading ? (
              <p className="font-pixel text-pixel-xs text-center text-white/40 py-8">
                LOADING...
              </p>
            ) : leaderboard.length === 0 ? (
              <p className="font-pixel text-pixel-xs text-center text-white/40 py-8">
                NO SCORES YET. BE FIRST!
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leaderboard.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-sm"
                    style={{
                      background:
                        i === 0
                          ? "rgba(255,215,0,0.08)"
                          : i === 1
                            ? "rgba(255,255,255,0.04)"
                            : i === 2
                              ? "rgba(255,107,0,0.08)"
                              : "rgba(18,18,26,1)",
                      border: `1px solid ${i === 0 ? "rgba(255,215,0,0.3)" : i === 1 ? "rgba(255,255,255,0.1)" : i === 2 ? "rgba(255,107,0,0.3)" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="font-pixel text-pixel-xs w-6 text-center"
                        style={{
                          color:
                            i === 0
                              ? "#FFD700"
                              : i === 1
                                ? "#aaa"
                                : i === 2
                                  ? "#FF6B00"
                                  : "#444",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-pixel text-pixel-xs text-white">
                        {entry.username}
                      </span>
                    </div>
                    <div className="flex gap-6 text-right">
                      <span className="font-pixel text-pixel-xs text-neon-green">
                        {entry.score}pts
                      </span>
                      <span className="font-pixel text-pixel-xs text-white/40">
                        {Math.floor((entry.total_time_secs || 0) / 60)}m
                        {(entry.total_time_secs || 0) % 60}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
