import React from "react";
import useGameStore from "../../store/useGameStore";

export default function ObjectiveTracker() {
  const rooms = useGameStore((s) => s.rooms);
  const activeScene = useGameStore((s) => s.activeScene);
  const currentRoom = useGameStore((s) => s.currentRoom);

  const nextRoom = rooms.find((r) => r.is_unlocked && !r.is_completed);
  const totalDone = rooms.filter((r) => r.is_completed).length;

  let objectiveText = "";
  if (activeScene === "lobby" || activeScene === "menu") {
    if (totalDone === 8) objectiveText = "ENTER THE FINAL CHAMBER!";
    else if (nextRoom) objectiveText = `ENTER: ${nextRoom.name?.toUpperCase()}`;
    else objectiveText = "EXPLORE THE LOBBY";
  } else if (currentRoom) {
    objectiveText = `SOLVE: ${currentRoom.name?.toUpperCase()}`;
  }

  return (
    <div className="glass-panel px-4 py-3 rounded-sm max-w-64">
      <p className="font-pixel text-pixel-xs text-neon-yellow/60 mb-1">
        OBJECTIVE
      </p>
      <p className="font-pixel text-pixel-xs text-neon-yellow">
        {objectiveText}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-neon-yellow rounded-full transition-all duration-500"
            style={{ width: `${(totalDone / 8) * 100}%` }}
          />
        </div>
        <span className="font-pixel text-pixel-xs text-white/40">
          {totalDone}/8
        </span>
      </div>
    </div>
  );
}
