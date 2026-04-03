import React, { useState } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const QUESTIONS = [
  {
    q: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Power Unit",
      "Core Processing Utility",
      "Central Program Unit",
    ],
    correct: 0,
  },
  {
    q: "Who invented the World Wide Web?",
    options: ["Bill Gates", "Tim Berners-Lee", "Steve Jobs", "Linus Torvalds"],
    correct: 1,
  },
  {
    q: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Protocol",
      "HyperText Transport Process",
      "Host Transfer Text Protocol",
    ],
    correct: 0,
  },
  {
    q: "Which language runs natively in a web browser?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correct: 2,
  },
  {
    q: "What is 10 in binary?",
    options: ["1010", "1100", "0101", "1001"],
    correct: 0,
  },
];

export default function InQuizitivePuzzle() {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey, completeRoomFrontend } = useGameStore();

  const handleAnswer = async (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === QUESTIONS[qIdx].correct;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);

    setTimeout(async () => {
      if (qIdx + 1 >= QUESTIONS.length) {
        if (newScore >= 3) {
          setSolved(true);
          solvePuzzle("inquizitive", "quiz");
          addKey("inquizitive");
          updateRoom("inquizitive", {
            is_completed: true,
            key_collected: true,
          });
          try {
            await roomAPI.completeRoom("inquizitive", { timeTaken: 100 });
          } catch (_) {}
          setTimeout(closePuzzle, 2000);
        } else {
          setQIdx(0);
          setScore(0);
          setSelected(null);
        }
      } else {
        setQIdx((q) => q + 1);
        setSelected(null);
      }
    }, 1000);
  };

  const q = QUESTIONS[qIdx];

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #FFD700",
        boxShadow: "0 0 20px rgba(255,215,0,0.3)",
      }}
    >
      <h2
        className="font-pixel text-pixel-md mb-2"
        style={{ color: "#FFD700" }}
      >
        INQUIZITIVE — TRIVIA
      </h2>

      {solved ? (
        <p className="font-pixel text-pixel-sm text-green-400 mt-4">
          PERFECT SCORE! Key acquired!
        </p>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <span className="font-pixel text-pixel-xs text-white/40">
              Q{qIdx + 1} / {QUESTIONS.length}
            </span>
            <span
              className="font-pixel text-pixel-xs"
              style={{ color: "#FFD700" }}
            >
              Score: {score}
            </span>
          </div>
          <p className="font-mono text-white mb-6 text-sm">{q.q}</p>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className="w-full text-left px-4 py-3 rounded-sm font-mono text-sm transition-all"
                style={{
                  background:
                    selected === null
                      ? "#1a1a2e"
                      : i === q.correct
                        ? "rgba(0,255,65,0.15)"
                        : selected === i
                          ? "rgba(255,0,0,0.15)"
                          : "#1a1a2e",
                  border: `2px solid ${
                    selected === null
                      ? "rgba(255,215,0,0.3)"
                      : i === q.correct
                        ? "#00FF41"
                        : selected === i
                          ? "#FF0000"
                          : "rgba(255,215,0,0.1)"
                  }`,
                  color:
                    selected === null
                      ? "rgba(255,255,255,0.8)"
                      : i === q.correct
                        ? "#00FF41"
                        : selected === i
                          ? "#FF6666"
                          : "rgba(255,255,255,0.3)",
                  cursor: selected !== null ? "default" : "pointer",
                }}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
          <p className="font-pixel text-pixel-xs text-white/40 mt-4">
            Need 3 / 5 correct to pass
          </p>
        </>
      )}
    </div>
  );
}
