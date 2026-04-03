import React, { useState, useEffect } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const SEQUENCES = [
  ["ArrowUp", "ArrowDown", "ArrowLeft"],
  ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowRight"],
  ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "ArrowUp"],
];
const ICONS = { ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→" };

export default function DynamightPuzzle() {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("watch");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [playerInput, setPlayerInput] = useState([]);
  const [message, setMessage] = useState("Watch the pattern...");
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, completeRoomFrontend } = useGameStore();

  useEffect(() => {
    if (phase !== "watch") return;
    let i = 0;
    const seq = SEQUENCES[round];
    const interval = setInterval(() => {
      if (i < seq.length) {
        setActiveIdx(i);
        i++;
      } else {
        clearInterval(interval);
        setActiveIdx(-1);
        setPhase("input");
        setMessage("Repeat the pattern using arrow keys!");
      }
    }, 700);
    return () => clearInterval(interval);
  }, [phase, round]);

  useEffect(() => {
    if (phase !== "input" || solved) return;
    const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    const handler = async (e) => {
      if (!ARROW_KEYS.includes(e.key)) return;
      e.preventDefault();

      const seq = SEQUENCES[round];
      const next = [...playerInput, e.key];
      setPlayerInput(next);

      if (next[next.length - 1] !== seq[next.length - 1]) {
        setMessage("Wrong! Watch again...");
        setPlayerInput([]);
        try {
          await roomAPI.trackAttempt("dynamight");
        } catch (_) {}
        setTimeout(() => {
          setPhase("watch");
          setMessage("Watch the pattern...");
        }, 1000);
        return;
      }

      if (next.length === seq.length) {
        const nextRound = round + 1;
        if (nextRound >= SEQUENCES.length) {
          setSolved(true);
          setMessage("PERFECT RHYTHM! Key acquired!");
          solvePuzzle("dynamight", "dance_pattern");
          addKey("dynamight");
          completeRoomFrontend("dynamight");
          try {
            await roomAPI.completeRoom("dynamight", { timeTaken: 100 });
          } catch (_) {}
          setTimeout(closePuzzle, 2000);
        } else {
          setMessage(`Round ${nextRound + 1}! Watch next pattern...`);
          setPlayerInput([]);
          setRound(nextRound);
          setTimeout(() => setPhase("watch"), 1200);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, playerInput, round, solved]);

  const seq = SEQUENCES[round];

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #FF4500",
        boxShadow: "0 0 20px rgba(255,69,0,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#FF4500" }}
      >
        DYNAMIGHT — DANCE PATTERN
      </h2>
      <p className="font-pixel text-pixel-xs text-white/60 mb-2">{message}</p>
      <p className="font-pixel text-pixel-xs text-white/30 mb-6">
        Round {round + 1} / {SEQUENCES.length}
      </p>

      <div className="flex justify-center gap-4 mb-6">
        {seq.map((key, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-sm text-3xl transition-all"
            style={{
              width: 56,
              height: 56,
              background:
                phase === "watch" && activeIdx === i
                  ? "rgba(255,69,0,0.3)"
                  : i < playerInput.length
                    ? "rgba(255,69,0,0.15)"
                    : "#1a1a2e",
              border: `3px solid ${
                phase === "watch" && activeIdx === i
                  ? "#FF4500"
                  : i < playerInput.length
                    ? "rgba(255,69,0,0.5)"
                    : "rgba(255,69,0,0.2)"
              }`,
              boxShadow:
                phase === "watch" && activeIdx === i
                  ? "0 0 20px #FF4500"
                  : "none",
              transform:
                phase === "watch" && activeIdx === i
                  ? "scale(1.2)"
                  : "scale(1)",
            }}
          >
            {ICONS[key]}
          </div>
        ))}
      </div>

      <p className="font-pixel text-pixel-xs text-white/30 text-center">
        Use arrow keys on your keyboard to repeat the pattern
      </p>
    </div>
  );
}
