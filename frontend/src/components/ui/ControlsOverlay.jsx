import React from "react";

const CONTROLS = [
  { key: "WASD", action: "MOVE" },
  { key: "MOUSE", action: "CAMERA" },
  { key: "E", action: "INTERACT" },
  { key: "SPACE", action: "JUMP" },
  { key: "Q", action: "EXIT ROOM" },
  { key: "ESC", action: "PAUSE" },
];

const panelStyle = {
  background: "rgba(10,10,20,0.85)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,0,255,0.4)",
  boxShadow: "0 0 8px rgba(255,0,255,0.3)",
  borderRadius: "2px",
  padding: "10px 12px",
  minWidth: "160px",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "6px",
};

const keyStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "8px",
  color: "#00FFFF",
  border: "1px solid rgba(0,255,255,0.5)",
  padding: "3px 6px",
  minWidth: "44px",
  textAlign: "center",
  lineHeight: "1.4",
};

const actionStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "8px",
  color: "rgba(255,255,255,0.55)",
  lineHeight: "1.4",
};

export default function ControlsOverlay() {
  return (
    <div style={panelStyle}>
      {CONTROLS.map(({ key, action }) => (
        <div key={key} style={rowStyle}>
          <span style={keyStyle}>{key}</span>
          <span style={actionStyle}>{action}</span>
        </div>
      ))}
    </div>
  );
}
