import React, { useState } from "react";
import useGameStore from "../../store/useGameStore";
import { roomAPI } from "../../services/api";

const PHASES = [
  {
    id: "binary",
    label: "Phase 1: Binary Decode",
    q: "What ASCII character does 01000001 represent?",
    answer: "A",
    hint: "01000001 = 65 in decimal = letter A",
  },
  {
    id: "sdlc",
    label: "Phase 2: SDLC Knowledge",
    q: 'What phase comes directly after "Requirements" in SDLC?',
    answer: "DESIGN",
    hint: "Requirements → Design → Development → Testing → Deployment",
  },
  {
    id: "code",
    label: "Phase 3: Debug Code",
    q: "In: for(i=0; i<=arr.length; i++) — what should <= be changed to?",
    answer: "<",
    hint: "Use < to prevent accessing arr[arr.length] which is undefined",
  },
  {
    id: "circuit",
    label: "Phase 4: Electronics",
    q: "How many pins does a standard Arduino Uno have for digital I/O?",
    answer: "14",
    hint: "Arduino Uno has 14 digital I/O pins (0-13)",
  },
  {
    id: "music",
    label: "Phase 5: Music Theory",
    q: "How many semitones are in one octave?",
    answer: "12",
    hint: "C C# D D# E F F# G G# A A# B = 12 semitones",
  },
  {
    id: "trivia",
    label: "Phase 6: Tech Trivia",
    q: 'What does "git" stand for in version control?',
    answer: "GIT",
    hint: 'Linus Torvalds named it "git" — British slang for a stupid person',
  },
  {
    id: "startup",
    label: "Phase 7: Startup Wisdom",
    q: "What is the term for the earliest usable version of a product? (abbrev.)",
    answer: "MVP",
    hint: "Minimum Viable Product — build the simplest thing that works",
  },
  {
    id: "dance",
    label: "Phase 8: Final Challenge",
    q: "Type the pattern exactly: UP DOWN LEFT RIGHT",
    answer: "UP DOWN LEFT RIGHT",
    hint: "Type it exactly as shown with spaces",
  },
];

export default function FinalPuzzle() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const { closePuzzle, solvePuzzle, addKey } =
    useGameStore();
  const completeRoomFrontend = useGameStore((s) => s.completeRoomFrontend);

  const handleSubmit = async () => {
    const phase = PHASES[phaseIdx];
    if (input.trim().toUpperCase() === phase.answer.toUpperCase()) {
      const next = phaseIdx + 1;
      if (next >= PHASES.length) {
        setSolved(true);
        setMessage("YOU HAVE ESCAPED! Congratulations!");
        solvePuzzle("final", "combined_challenge");
        addKey("final");
        updateRoom("final", { is_completed: true, key_collected: true });
        setGameCompleted(true);
        try {
          await roomAPI.completeRoom("final", { timeTaken: 300 });
        } catch (_) {}
        setTimeout(closePuzzle, 3000);
      } else {
        setMessage(`Phase ${next + 1} unlocked!`);
        setPhaseIdx(next);
        setInput("");
        setTimeout(() => setMessage(""), 800);
      }
    } else {
      setMessage(`Wrong. Hint: ${phase.hint}`);
      try {
        await roomAPI.trackAttempt("final");
      } catch (_) {}
    }
  };

  const phase = PHASES[phaseIdx];

  return (
    <div
      className="glass-panel p-8 rounded-sm"
      style={{
        border: "2px solid #FFFFFF",
        boxShadow: "0 0 30px rgba(255,255,255,0.15)",
      }}
    >
      <h2 className="font-pixel text-pixel-md mb-4 text-white">
        FINAL CHAMBER
      </h2>

      {solved ? (
        <div className="text-center py-8">
          <p className="font-pixel text-pixel-lg text-neon-yellow text-glow-yellow animate-neon-pulse">
            YOU ESCAPED!
          </p>
          <p className="font-pixel text-pixel-xs text-white/60 mt-6">
            Score is being submitted...
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 mb-6">
            {PHASES.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  background:
                    i < phaseIdx
                      ? "#00FF41"
                      : i === phaseIdx
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

          <p className="font-pixel text-pixel-xs text-white/40 mb-1">
            {phase.label}
          </p>
          <p className="font-mono text-white mb-6 text-sm">{phase.q}</p>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your answer..."
              className="input-neon flex-1"
              autoFocus
            />
            <button onClick={handleSubmit} className="btn-neon-cyan px-6">
              GO
            </button>
          </div>

          {message && (
            <p
              className={`font-pixel text-pixel-xs mt-4 ${
                message.includes("unlocked") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <p className="font-pixel text-pixel-xs text-white/20 mt-4 text-center">
            Phase {phaseIdx + 1} of {PHASES.length}
          </p>
        </>
      )}
    </div>
  );
}
