import React from "react";
import ControlsOverlay from "./ControlsOverlay";
import Inventory from "./Inventory";
import InteractionPrompt from "./InteractionPrompt";

import { useNavigate } from "react-router-dom";
import useGameStore from "../../store/useGameStore";

// ✅ FIX: use inline styles instead of Tailwind positioning classes.
//    If the CSS bundle is slow to load, Tailwind classes silently fail.
//    Inline styles always apply immediately.

export default function HUD() {
  const navigate = useNavigate();
  const logout = useGameStore((s) => s.logout);

  return (
    <>
      {/* Top-left: controls reference */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <ControlsOverlay />
      </div>

      {/* Top-right: key inventory and logout */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          pointerEvents: "auto", // allow clicking logout
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px"
        }}
      >
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="btn-neon-magenta text-pixel-xs px-3 py-1"
          style={{ width: "fit-content" }}
        >
          SIGN OUT
        </button>
        <Inventory />
      </div>



      {/* Bottom-center: interaction prompt */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <InteractionPrompt />
      </div>
    </>
  );
}
