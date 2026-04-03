import React from "react";
import useGameStore from "../../store/useGameStore";

const ROOMS_ORDER = [
  { slug: "technosys", short: "TEC", color: "#00FFFF" },
  { slug: "velocity", short: "VEL", color: "#FF6B00" },
  { slug: "return0", short: "R0", color: "#00FF41" },
  { slug: "iris", short: "IRS", color: "#FF0080" },
  { slug: "inquizitive", short: "IQV", color: "#FFD700" },
  { slug: "ecell", short: "ECL", color: "#9B59B6" },
  { slug: "hertz440", short: "440", color: "#FF69B4" },
  { slug: "dynamight", short: "DYN", color: "#FF4500" },
];

const panelStyle = {
  background: "rgba(10,10,20,0.85)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,0,255,0.4)",
  boxShadow: "0 0 8px rgba(255,0,255,0.3)",
  borderRadius: "2px",
  padding: "10px 12px",
};

const labelStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "8px",
  color: "#00FFFF",
  marginBottom: "8px",
  display: "block",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 36px)",
  gap: "4px",
};

export default function Inventory() {
  const inventory = useGameStore((s) => s.inventory);

  return (
    <div style={panelStyle}>
      <span style={labelStyle}>KEYS {inventory.length}/8</span>
      <div style={gridStyle}>
        {ROOMS_ORDER.map(({ slug, short, color }) => {
          const collected = inventory.includes(slug);
          return (
            <div
              key={slug}
              style={{
                width: "36px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "2px",
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "7px",
                background: collected ? `${color}22` : "rgba(255,255,255,0.03)",
                border: `1px solid ${collected ? color : "rgba(255,255,255,0.1)"}`,
                color: collected ? color : "#444",
                boxShadow: collected ? `0 0 6px ${color}` : "none",
                transition: "all 0.3s ease",
              }}
            >
              {short}
            </div>
          );
        })}
      </div>
    </div>
  );
}
