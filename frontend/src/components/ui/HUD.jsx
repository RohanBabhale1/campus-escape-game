import React from "react";
import ControlsOverlay from "./ControlsOverlay";
import Inventory from "./Inventory";
import ObjectiveTracker from "./ObjectiveTracker";
import InteractionPrompt from "./InteractionPrompt";

// ✅ FIX: use inline styles instead of Tailwind positioning classes.
//    If the CSS bundle is slow to load, Tailwind classes silently fail.
//    Inline styles always apply immediately.

export default function HUD() {
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

      {/* Top-right: key inventory */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <Inventory />
      </div>

      {/* Bottom-left: objective tracker */}
      <div
        style={{
          position: "absolute",
          bottom: "6rem",
          left: "1rem",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <ObjectiveTracker />
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
