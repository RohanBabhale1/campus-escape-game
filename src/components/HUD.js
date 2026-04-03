import React, { useState, useEffect } from 'react';

const HUD = () => {
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '9') {
        setShowTutorial((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <h1 style={{
          margin: 0,
          color: '#fff',
          fontSize: '2rem',
          fontWeight: '900',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          textShadow: '0 0 10px rgba(0,0,0,0.5)',
          background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ClubVerse 3D
        </h1>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
        <div style={{
          color: '#eee',
          fontSize: '0.8rem',
          marginBottom: '5px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}>
          Press <b>9</b> to {showTutorial ? 'hide' : 'show'} tutorial
        </div>
        {showTutorial && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '12px',
            color: '#eee',
            fontSize: '0.9rem',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ marginBottom: '8px' }}>Use <b>WASD</b> to explore the campus</div>
            <div style={{ padding: '2px 0', fontSize: '0.8rem', color: '#ccc' }}>
              <b>Left-Click Drag</b> to Rotate Camera
            </div>
            <div style={{ padding: '2px 0', fontSize: '0.8rem', color: '#ccc' }}>
              <b>Right-Click Drag</b> to Pan
            </div>
            <div style={{ padding: '2px 0', fontSize: '0.8rem', color: '#ccc', marginTop: '5px' }}>
              Press <b>Shift + L</b> to Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;
