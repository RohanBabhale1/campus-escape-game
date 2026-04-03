import React, { useState, useMemo } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const CORRECT_ORDER = [
  "Requirements",
  "Design",
  "Development",
  "Testing",
  "Deployment",
];

export default function VelocityPuzzle() {
  const cards = useMemo(
    () => [...CORRECT_ORDER].sort(() => Math.random() - 0.5),
    [],
  );
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState(
    "Click the SDLC stages in the correct order.",
  );
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, updateRoom } = useGameStore();

  const handleSelect = async (card) => {
    if (solved || selected.includes(card)) return;
    const next = [...selected, card];
    setSelected(next);

    if (next[next.length - 1] !== CORRECT_ORDER[next.length - 1]) {
      setMessage("Wrong order! Starting over...");
      setTimeout(() => {
        setSelected([]);
        setMessage("Click the SDLC stages in the correct order.");
      }, 1000);
      try {
        await roomAPI.trackAttempt("velocity");
      } catch (_) {}
      return;
    }

    if (next.length === CORRECT_ORDER.length) {
      setSolved(true);
      setMessage("CORRECT ORDER! Key acquired!");
      solvePuzzle("velocity", "sdlc_order");
      addKey("velocity");
      updateRoom("velocity", { is_completed: true, key_collected: true });
      try {
        await roomAPI.completeRoom("velocity", { timeTaken: 90 });
      } catch (_) {}
      setTimeout(closePuzzle, 2000);
    }
  };

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #FF6B00",
        boxShadow: "0 0 20px rgba(255,107,0,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#FF6B00" }}
      >
        VELOCITY — SDLC ORDER
      </h2>
      <p className="font-pixel text-pixel-xs text-white/60 mb-6">{message}</p>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {cards.map((card) => {
          const idx = selected.indexOf(card);
          return (
            <button
              key={card}
              onClick={() => handleSelect(card)}
              disabled={solved || selected.includes(card)}
              className="font-pixel text-pixel-xs px-4 py-3 rounded-sm transition-all cursor-pointer"
              style={{
                background: idx !== -1 ? "rgba(255,107,0,0.2)" : "#1a1a2e",
                border: `2px solid ${idx !== -1 ? "#FF6B00" : "rgba(255,107,0,0.3)"}`,
                color: idx !== -1 ? "#FF6B00" : "rgba(255,255,255,0.5)",
                boxShadow: idx !== -1 ? "0 0 10px rgba(255,107,0,0.4)" : "none",
                opacity: selected.includes(card) && !solved ? 0.5 : 1,
              }}
            >
              {idx !== -1 ? `${idx + 1}. ` : ""}
              {card}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-2">
        {CORRECT_ORDER.map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border border-orange-500 transition-all"
            style={{
              background: i < selected.length ? "#FF6B00" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
