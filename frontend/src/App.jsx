import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CampusHub from "./pages/CampusHub";
import GamePage from "./pages/GamePage";
import useGameStore from "./store/useGameStore";

import { authAPI } from "./services/api";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const logout = useGameStore((s) => s.logout);
  const [verifying, setVerifying] = React.useState(true);

  React.useEffect(() => {
    if (!isLoggedIn) {
      setVerifying(false);
      return;
    }
    
    authAPI.getMe()
      .then(() => setVerifying(false))
      .catch(() => {
         logout();
         setVerifying(false);
      });
  }, [isLoggedIn, logout]);

  if (verifying) {
    return (
      <div style={{ backgroundColor: "#0a0a0f", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontFamily: '"Press Start 2P", monospace', color: "#00FFFF" }}>VERIFYING CREDENTIALS...</p>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    // ✅ FIX: explicit 100vh wrapper — BrowserRouter/Routes have no DOM height,
    //    so h-full on child pages collapses to 0. This anchors the whole tree.
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CampusHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
