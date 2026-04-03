import React from 'react';

const HUD = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: '20px',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 10
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
      <div style={{
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: '20px',
        color: '#eee',
        fontSize: '0.9rem',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ marginBottom: '5px' }}>Use <b>WASD</b> to explore the campus</div>
        <div style={{ padding: '2px', fontSize: '0.8rem', color: '#ccc', textAlign: 'center' }}>
          <b>Left-Click Drag</b> to Rotate Camera
        </div>
        <div style={{ padding: '2px', fontSize: '0.8rem', color: '#ccc', textAlign: 'center' }}>
          <b>Right-Click Drag</b> to Pan
        </div>
        <div style={{ padding: '2px', fontSize: '0.8rem', color: '#ccc', textAlign: 'center', marginTop: '5px' }}>
          Press <b>Shift + L</b> to Logout
        </div>
      </div>
    </div>
  );
};

export default HUD;
