import React, { lazy, Suspense } from "react";
import useGameStore from "../../store/useGameStore";

const PUZZLE_MAP = {
  technosys: lazy(() => import("./TechnosysPuzzle")),
  velocity: lazy(() => import("./VelocityPuzzle")),
  return0: lazy(() => import("./Return0Puzzle")),
  iris: lazy(() => import("./IRISPuzzle")),
  inquizitive: lazy(() => import("./InQuizitivePuzzle")),
  ecell: lazy(() => import("./ECellPuzzle")),
  hertz440: lazy(() => import("./Hertz440Puzzle")),
  dynamight: lazy(() => import("./DynamightPuzzle")),
  final: lazy(() => import("./FinalPuzzle")),
};

// Overlay styles written as inline objects so they apply immediately —
// no dependency on Tailwind CSS being processed first.
const overlayStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(10, 10, 15, 0.80)",
  backdropFilter: "blur(8px)",
  // pointer-events must be 'auto' so puzzle buttons/inputs are clickable
  pointerEvents: "auto",
};

const innerStyle = {
  position: "relative",
  width: "100%",
  maxWidth: "680px",
  margin: "0 16px",
};

const closeButtonStyle = {
  position: "absolute",
  top: "-16px",
  right: "-16px",
  zIndex: 10,
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "10px",
  color: "#f87171",
  border: "1px solid rgba(248, 113, 113, 0.5)",
  padding: "8px 12px",
  background: "#0a0a0f",
  cursor: "pointer",
  lineHeight: 1,
};

const loadingStyle = {
  background: "rgba(10, 10, 20, 0.85)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 0, 255, 0.3)",
  padding: "32px",
  textAlign: "center",
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "10px",
  color: "#00FFFF",
};

export default function ActivePuzzleOverlay() {
  const activePuzzle = useGameStore((s) => s.activePuzzle);
  const closePuzzle = useGameStore((s) => s.closePuzzle);

  if (!activePuzzle) return null;

  const PuzzleComponent = PUZZLE_MAP[activePuzzle];
  if (!PuzzleComponent) return null;

  return (
    <div style={overlayStyle}>
      <div style={innerStyle}>
        <button
          onClick={closePuzzle}
          style={closeButtonStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0a0a0f")}
        >
          ✕ CLOSE
        </button>

        <Suspense fallback={<div style={loadingStyle}>LOADING PUZZLE...</div>}>
          <PuzzleComponent />
        </Suspense>
      </div>
    </div>
  );
}
