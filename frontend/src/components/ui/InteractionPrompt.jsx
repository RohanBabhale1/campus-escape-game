import React from "react";
import useGameStore from "../../store/useGameStore";

export default function InteractionPrompt() {
  const target = useGameStore((s) => s.interactionTarget);
  if (!target) return null;

  return (
    <div className="glass-panel px-6 py-3 rounded-full pixel-border-cyan animate-float text-center">
      <span className="font-pixel text-pixel-xs text-white/60 mr-3">PRESS</span>
      <span className="font-pixel text-pixel-xs text-neon-cyan text-glow-cyan border border-neon-cyan px-2 py-1 mr-3">
        E
      </span>
      <span className="font-pixel text-pixel-xs text-neon-cyan">
        {target.label?.toUpperCase()}
      </span>
    </div>
  );
}
