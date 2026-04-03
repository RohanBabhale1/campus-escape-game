import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import GameCanvas3D from "./components/GameCanvas3D";
import HUD from "./components/HUD";
import Auth from "./components/Auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('clubverse_token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data.user);
    })
    .catch(() => {
      localStorage.removeItem('clubverse_token');
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'l') {
        localStorage.removeItem('clubverse_token');
        setUser(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return <div style={{width:'100%', height:'100vh', background:'#000', color:'#fff', display:'flex', justifyContent:'center', alignItems:'center'}}>Loading ClubVerse...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Auth onAuth={setUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={
            user ? (
              <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
                <HUD />
                <GameCanvas3D user={user} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;