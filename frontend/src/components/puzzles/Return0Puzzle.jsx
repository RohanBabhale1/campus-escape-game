import React, { useState } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const BUGS = [
  {
    lines: [
      "function sum(arr) {",
      "  let total = 0;",
      "  for (let i = 0; i <= arr.length; i++) {",
      "    total += arr[i];",
      "  }",
      "  return total;",
      "}",
    ],
    bugLine: 2,
    explanation:
      "i <= arr.length causes out-of-bounds. Should be i < arr.length",
  },
  {
    lines: [
      "function findMax(arr) {",
      "  let max = 0;",
      "  for (let i = 0; i < arr.length; i++) {",
      "    if (arr[i] > max) max = arr[i];",
      "  }",
      "  return max;",
      "}",
    ],
    bugLine: 1,
    explanation:
      "max should be arr[0] or -Infinity, not 0 (fails for all-negative arrays)",
  },
  {
    lines: [
      "function isPalindrome(str) {",
      "  const rev = str.split('').reverse().join('');",
      "  return str == rev;",
      "}",
    ],
    bugLine: 2,
    explanation: "Use === (strict equality) instead of == (loose equality)",
  },
];

export default function Return0Puzzle() {
  const [bugIdx, setBugIdx] = useState(0);
  const [message, setMessage] = useState("Click the buggy line!");
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, completeRoomFrontend } = useGameStore();

  const handleLineClick = async (lineIdx) => {
    if (solved) return;
    const bug = BUGS[bugIdx];
    if (lineIdx === bug.bugLine) {
      const next = bugIdx + 1;
      setMessage(`FOUND: ${bug.explanation}`);
      if (next >= BUGS.length) {
        setSolved(true);
        solvePuzzle("return0", "debug_puzzle");
        addKey("return0");
        completeRoomFrontend("return0");
        try {
          await roomAPI.completeRoom("return0", { timeTaken: 120 });
        } catch (_) {}
        setTimeout(closePuzzle, 2500);
      } else {
        setTimeout(() => {
          setBugIdx(next);
          setMessage("Click the buggy line!");
        }, 1500);
      }
    } else {
      setMessage("Not the bug. Try another line.");
      try {
        await roomAPI.trackAttempt("return0");
      } catch (_) {}
    }
  };

  const bug = BUGS[bugIdx];

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #00FF41",
        boxShadow: "0 0 20px rgba(0,255,65,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#00FF41" }}
      >
        RETURN 0 — DEBUG THE CODE
      </h2>
      <p className="font-mono text-white/60 text-sm mb-2">
        Bug {bugIdx + 1} of {BUGS.length} — Click the line with the bug:
      </p>
      <div
        className="rounded-sm mb-4 overflow-hidden"
        style={{
          background: "#0d1a0d",
          border: "1px solid rgba(0,255,65,0.2)",
        }}
      >
        {bug.lines.map((line, i) => (
          <div
            key={i}
            onClick={() => handleLineClick(i)}
            className="flex items-start cursor-pointer px-4 py-1.5 hover:bg-green-400/10 transition-colors"
          >
            <span className="text-white/30 mr-4 select-none font-mono text-sm w-4 shrink-0">
              {i + 1}
            </span>
            <span className="text-green-300 font-mono text-sm whitespace-pre">
              {line}
            </span>
          </div>
        ))}
      </div>
      <p
        className={`font-pixel text-pixel-xs ${
          solved
            ? "text-green-400"
            : message.startsWith("FOUND")
              ? "text-green-400"
              : message.startsWith("Not")
                ? "text-red-400"
                : "text-white/60"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
