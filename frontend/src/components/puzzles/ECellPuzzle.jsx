import React, { useState } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const SCENARIOS = [
  {
    q: "Your startup has limited funding. What do you prioritize first?",
    options: [
      "Hire a large sales team",
      "Build MVP and validate with customers",
      "Spend on expensive office space",
      "File patents immediately",
    ],
    correct: 1,
    reason:
      "Build MVP first — validate your idea before spending on anything else.",
  },
  {
    q: "A competitor launches a similar product. What do you do?",
    options: [
      "Panic and pivot completely",
      "Analyze and find your differentiator",
      "Copy their features exactly",
      "Ignore them completely",
    ],
    correct: 1,
    reason:
      "Analyze and differentiate — competition actually validates the market.",
  },
  {
    q: "Your app has 100 users but zero revenue. What is next?",
    options: [
      "Raise VC funding immediately",
      "Experiment with monetization models",
      "Add every feature users request",
      "Shut down and pivot",
    ],
    correct: 1,
    reason:
      "Experiment with monetization — find what users will actually pay for.",
  },
];

export default function ECellPuzzle() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, updateRoom } = useGameStore();

  const handleAnswer = async (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === SCENARIOS[idx].correct;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);

    setTimeout(async () => {
      if (idx + 1 >= SCENARIOS.length) {
        if (newScore >= 2) {
          setSolved(true);
          solvePuzzle("ecell", "business_decisions");
          addKey("ecell");
          updateRoom("ecell", { is_completed: true, key_collected: true });
          try {
            await roomAPI.completeRoom("ecell", { timeTaken: 90 });
          } catch (_) {}
          setTimeout(closePuzzle, 2000);
        } else {
          setIdx(0);
          setScore(0);
          setSelected(null);
        }
      } else {
        setIdx((i) => i + 1);
        setSelected(null);
      }
    }, 1500);
  };

  const s = SCENARIOS[idx];

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #9B59B6",
        boxShadow: "0 0 20px rgba(155,89,182,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#9B59B6" }}
      >
        E-CELL — STARTUP DECISIONS
      </h2>

      {solved ? (
        <p className="font-pixel text-pixel-sm text-green-400 mt-4">
          ENTREPRENEUR MINDSET! Key acquired!
        </p>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <span className="font-pixel text-pixel-xs text-white/40">
              Scenario {idx + 1} / {SCENARIOS.length}
            </span>
            <span
              className="font-pixel text-pixel-xs"
              style={{ color: "#9B59B6" }}
            >
              Score: {score}
            </span>
          </div>
          <p className="font-mono text-white mb-6 text-sm">{s.q}</p>
          <div className="space-y-3">
            {s.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className="w-full text-left px-4 py-3 rounded-sm font-mono text-sm transition-all"
                style={{
                  background:
                    selected === null
                      ? "#1a1a2e"
                      : i === s.correct
                        ? "rgba(155,89,182,0.2)"
                        : selected === i
                          ? "rgba(255,0,0,0.15)"
                          : "#1a1a2e",
                  border: `2px solid ${
                    selected === null
                      ? "rgba(155,89,182,0.3)"
                      : i === s.correct
                        ? "#9B59B6"
                        : selected === i
                          ? "#FF0000"
                          : "rgba(155,89,182,0.1)"
                  }`,
                  color:
                    selected === null
                      ? "rgba(255,255,255,0.8)"
                      : i === s.correct
                        ? "#9B59B6"
                        : selected === i
                          ? "#FF6666"
                          : "rgba(255,255,255,0.3)",
                  cursor: selected !== null ? "default" : "pointer",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {selected !== null && (
            <p
              className="font-pixel text-pixel-xs mt-4"
              style={{ color: "#9B59B6" }}
            >
              {s.reason}
            </p>
          )}
          <p className="font-pixel text-pixel-xs text-white/40 mt-3">
            Need 2 / 3 correct to pass
          </p>
        </>
      )}
    </div>
  );
}
