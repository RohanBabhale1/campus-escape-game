import React, { useState, useEffect } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const NOTE_COLORS = [
  "#FF00FF",
  "#FF6B00",
  "#FFFF00",
  "#00FF41",
  "#00FFFF",
  "#9B59B6",
  "#FF69B4",
];
const SEQUENCE = [2, 5, 0, 4, 1, 3, 6];

export default function Hertz440Puzzle() {
  const [phase, setPhase] = useState("watch");
  const [activeNote, setActiveNote] = useState(null);
  const [playerInput, setPlayerInput] = useState([]);
  const [message, setMessage] = useState("Watch the sequence...");
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, updateRoom } = useGameStore();

  useEffect(() => {
    if (phase !== "watch") return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < SEQUENCE.length) {
        setActiveNote(SEQUENCE[i]);
        i++;
      } else {
        clearInterval(interval);
        setActiveNote(null);
        setPhase("input");
        setMessage("Now repeat the sequence!");
      }
    }, 700);
    return () => clearInterval(interval);
  }, [phase]);

  const handleNotePress = async (noteIdx) => {
    if (phase !== "input" || solved) return;
    const next = [...playerInput, noteIdx];
    setPlayerInput(next);

    if (next[next.length - 1] !== SEQUENCE[next.length - 1]) {
      setMessage("Wrong! Watch again...");
      setPlayerInput([]);
      try {
        await roomAPI.trackAttempt("hertz440");
      } catch (_) {}
      setTimeout(() => {
        setPhase("watch");
        setMessage("Watch the sequence...");
      }, 1200);
      return;
    }

    if (next.length === SEQUENCE.length) {
      setSolved(true);
      setMessage("PERFECT SEQUENCE! Key acquired!");
      solvePuzzle("hertz440", "note_sequence");
      addKey("hertz440");
      updateRoom("hertz440", { is_completed: true, key_collected: true });
      try {
        await roomAPI.completeRoom("hertz440", { timeTaken: 90 });
      } catch (_) {}
      setTimeout(closePuzzle, 2000);
    }
  };

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #FF69B4",
        boxShadow: "0 0 20px rgba(255,105,180,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#FF69B4" }}
      >
        440 HERTZ — NOTE SEQUENCE
      </h2>
      <p className="font-pixel text-pixel-xs text-white/60 mb-6">{message}</p>

      <div className="flex justify-center gap-2 mb-6">
        {NOTES.map((note, idx) => (
          <button
            key={idx}
            onClick={() => handleNotePress(idx)}
            disabled={phase !== "input" || solved}
            className="rounded-sm font-pixel text-pixel-xs transition-all flex items-end justify-center pb-2"
            style={{
              width: 48,
              height: 80,
              background:
                activeNote === idx
                  ? NOTE_COLORS[idx]
                  : playerInput.includes(idx)
                    ? `${NOTE_COLORS[idx]}33`
                    : "#1a1a2e",
              border: `2px solid ${NOTE_COLORS[idx]}`,
              boxShadow:
                activeNote === idx ? `0 0 20px ${NOTE_COLORS[idx]}` : "none",
              color: NOTE_COLORS[idx],
              transform: activeNote === idx ? "scaleY(1.05)" : "scaleY(1)",
              cursor: phase !== "input" ? "default" : "pointer",
            }}
          >
            {note}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {SEQUENCE.map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border transition-all"
            style={{
              borderColor: "#FF69B4",
              background: i < playerInput.length ? "#FF69B4" : "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
