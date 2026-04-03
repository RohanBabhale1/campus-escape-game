import React, { useState } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const NODES = [
  { id: "A", x: 50, y: 50, label: "PWR" },
  { id: "B", x: 230, y: 80, label: "AMP" },
  { id: "C", x: 150, y: 210, label: "CPU" },
  { id: "D", x: 320, y: 230, label: "OUT" },
];
const CORRECT = ["A", "B", "C", "D"];

export default function IRISPuzzle() {
  const [connected, setConnected] = useState([]);
  const [message, setMessage] = useState(
    "Connect the circuit: PWR → AMP → CPU → OUT",
  );
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, completeRoomFrontend } = useGameStore();

  const handleNode = async (id) => {
    if (solved) return;
    const expected = CORRECT[connected.length];
    if (id === expected) {
      const next = [...connected, id];
      setConnected(next);
      if (next.length === CORRECT.length) {
        setSolved(true);
        setMessage("CIRCUIT COMPLETE! Key acquired!");
        solvePuzzle("iris", "circuit_puzzle");
        addKey("iris");
        completeRoomFrontend("iris");
        try {
          await roomAPI.completeRoom("iris", { timeTaken: 80 });
        } catch (_) {}
        setTimeout(closePuzzle, 2000);
      } else {
        setMessage(`Connected! Next: ${NODES[next.length].label}`);
      }
    } else {
      setMessage("Wrong node! Start over.");
      setConnected([]);
      try {
        await roomAPI.trackAttempt("iris");
      } catch (_) {}
    }
  };

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #FF0080",
        boxShadow: "0 0 20px rgba(255,0,128,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#FF0080" }}
      >
        IRIS — CIRCUIT CONNECTION
      </h2>
      <p className="font-pixel text-pixel-xs text-white/60 mb-6">{message}</p>

      <div
        className="relative mx-auto rounded-sm"
        style={{
          width: 420,
          height: 300,
          background: "#0a0a1a",
          border: "1px solid rgba(255,0,128,0.2)",
        }}
      >
        <svg className="absolute inset-0" width="420" height="300">
          {connected.map((id, i) => {
            if (i === 0) return null;
            const from = NODES.find((n) => n.id === connected[i - 1]);
            const to = NODES.find((n) => n.id === id);
            return (
              <line
                key={i}
                x1={from.x + 28}
                y1={from.y + 20}
                x2={to.x + 28}
                y2={to.y + 20}
                stroke="#FF0080"
                strokeWidth="3"
                style={{ filter: "drop-shadow(0 0 6px #FF0080)" }}
              />
            );
          })}
        </svg>

        {NODES.map((node) => {
          const isConnected = connected.includes(node.id);
          const isNext = node.id === CORRECT[connected.length];
          return (
            <button
              key={node.id}
              onClick={() => handleNode(node.id)}
              className="absolute flex items-center justify-center rounded font-pixel text-pixel-xs transition-all"
              style={{
                left: node.x,
                top: node.y,
                width: 56,
                height: 40,
                background: isConnected
                  ? "rgba(255,0,128,0.2)"
                  : isNext
                    ? "rgba(255,0,128,0.08)"
                    : "#1a1a2e",
                border: `2px solid ${isConnected ? "#FF0080" : isNext ? "rgba(255,0,128,0.6)" : "rgba(255,0,128,0.2)"}`,
                boxShadow: isConnected
                  ? "0 0 15px #FF0080"
                  : isNext
                    ? "0 0 8px rgba(255,0,128,0.4)"
                    : "none",
                color: isConnected
                  ? "#FF0080"
                  : isNext
                    ? "rgba(255,0,128,0.8)"
                    : "rgba(255,255,255,0.4)",
                cursor: isConnected ? "default" : "pointer",
              }}
            >
              {node.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
