import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import GamePage from "./pages/GamePage";
import useGameStore from "./store/useGameStore";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
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
        <div className="scanlines" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
