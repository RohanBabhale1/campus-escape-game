import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import useGameStore from "../store/useGameStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useGameStore((s) => s.setAuth);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await authAPI.login({ email: form.email, password: form.password })
          : await authAPI.register(form);
      setAuth(res.data.token, res.data.user);
      navigate("/menu");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Inline styles ensure centering works even before Tailwind CSS hydrates */
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        background: "#0a0a0f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(#FF00FF 1px, transparent 1px), linear-gradient(90deg, #FF00FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            className="font-pixel text-pixel-xl text-neon-magenta text-glow-magenta animate-flicker"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.25rem",
              color: "#FF00FF",
              textShadow: "0 0 8px #FF00FF, 0 0 20px #FF00FF",
              lineHeight: 1.4,
              marginBottom: "8px",
              display: "block",
            }}
          >
            ESCAPE ROOM
          </h1>
          <p
            className="font-pixel text-pixel-xs text-neon-cyan text-glow-cyan"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "0.625rem",
              color: "#00FFFF",
              textShadow: "0 0 8px #00FFFF",
            }}
          >
            COLLEGE EDITION
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(10, 10, 20, 0.90)",
            backdropFilter: "blur(8px)",
            border: "2px solid #FF00FF",
            boxShadow: "0 0 8px #FF00FF",
            borderRadius: "2px",
            padding: "32px",
          }}
        >
          {/* Login / Register tabs */}
          <div style={{ display: "flex", marginBottom: "32px" }}>
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                style={{
                  flex: 1,
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  padding: "12px",
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.2s",
                  background: mode === m ? "#FF00FF" : "transparent",
                  color: mode === m ? "#0a0a0f" : "rgba(255,0,255,0.5)",
                  borderBottom:
                    mode === m ? "none" : "1px solid rgba(255,0,255,0.3)",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {mode === "register" && (
              <div>
                <label
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "0.5rem",
                    color: "rgba(0,255,255,0.7)",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  USERNAME
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="PlayerOne"
                  required
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>EMAIL</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="player@college.edu"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "0.5rem",
                  color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.3)",
                  padding: "12px",
                  borderRadius: "2px",
                  background: "rgba(248,113,113,0.08)",
                }}
              >
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "14px",
                border: "2px solid #FF00FF",
                borderRadius: "9999px",
                cursor: loading ? "not-allowed" : "pointer",
                color: "#FF00FF",
                background: "transparent",
                boxShadow: "0 0 8px #FF00FF",
                marginTop: "8px",
                transition: "all 0.2s",
                opacity: loading ? 0.6 : 1,
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#FF00FF";
                  e.currentTarget.style.color = "#0a0a0f";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FF00FF";
              }}
            >
              {loading
                ? "LOADING..."
                : mode === "login"
                  ? "ENTER GAME"
                  : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>

        <p
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "0.5rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.18)",
            marginTop: "24px",
          }}
        >
          PRESS START TO ESCAPE
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: "0.5rem",
  color: "rgba(0,255,255,0.7)",
  display: "block",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  background: "#0a0a0f",
  border: "1px solid #FF00FF",
  color: "#ffffff",
  fontFamily: '"Courier New", monospace',
  padding: "12px 16px",
  borderRadius: "2px",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
  boxShadow: "inset 0 0 10px rgba(255,0,255,0.05)",
};
