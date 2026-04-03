import React, { useState } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const BINARY_CLUE = "01001000 01000001 01000011 01001011";
const ANSWER = "HACK";

export default function TechnosysPuzzle() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, completeRoomFrontend } = useGameStore();

  const handleSubmit = async () => {
    if (input.trim().toUpperCase() === ANSWER) {
      setSolved(true);
      setMessage("CORRECT! Key acquired!");
      solvePuzzle("technosys", "binary_puzzle");
      addKey("technosys");
      completeRoomFrontend("technosys");
      try {
        await roomAPI.completeRoom("technosys", { timeTaken: 120 });
      } catch (_) {}
      setTimeout(closePuzzle, 2000);
    } else {
      setMessage("WRONG. Try again.");
      try {
        await roomAPI.trackAttempt("technosys");
      } catch (_) {}
    }
  };

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #00FFFF",
        boxShadow: "0 0 20px rgba(0,255,255,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#00FFFF" }}
      >
        TECHNOSYS — BINARY DECODE
      </h2>
      <p className="font-mono text-white/60 text-sm mb-6">
        Decode the binary string to find the secret code word.
      </p>

      <div
        className="bg-void-light p-4 rounded-sm mb-6"
        style={{ border: "1px solid rgba(0,255,65,0.3)" }}
      >
        <p className="font-mono text-green-400 text-sm tracking-widest break-all">
          {BINARY_CLUE}
        </p>
        <p className="font-pixel text-pixel-xs text-white/30 mt-2">
          ASCII BINARY — EACH 8 BITS = 1 LETTER
        </p>
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="ENTER CODE WORD"
          maxLength={10}
          disabled={solved}
          className="input-neon flex-1 uppercase tracking-widest"
        />
        <button
          onClick={handleSubmit}
          disabled={solved}
          className="btn-neon-cyan px-6"
        >
          SUBMIT
        </button>
      </div>

      {message && (
        <p
          className={`font-pixel text-pixel-xs mt-4 ${solved ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
