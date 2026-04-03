import React, { useState, useEffect, useRef } from 'react';

const FootballGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  
  // Game States
  const [gameState, setGameState] = useState('START'); // START, KICKING, RESULT, GAMEOVER
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  
  const MAX_ATTEMPTS = 5;
  
  // Game Loop Refs
  const gameRef = useRef({
    ball: { x: 150, y: 320, active: false, targetX: 150 },
    gk: { x: 150, targetX: 150, isDiving: false },
    meter: { x: 50, direction: 1, active: true },
    waitingForNextShot: false
  });

  const resetShotContext = () => {
    gameRef.current.ball = { x: 150, y: 320, active: false, targetX: 150 };
    gameRef.current.gk = { x: 150, targetX: 150, isDiving: false };
    gameRef.current.meter = { x: 50, direction: 1, active: true };
    gameRef.current.waitingForNextShot = false;
    setMessage('Press Space to aim!');
    setGameState('PLAYING');
  };

  const startGame = () => {
    setScore(0);
    setAttempts(0);
    resetShotContext();
  };

  const draw = (ctx) => {
    // Pitch (Grass Stripes)
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#27ae60' : '#2ecc71';
        ctx.fillRect(0, i * 50, 300, 50);
    }

    // Penalty box lines
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 0, 200, 150); // Penalty Area
    ctx.strokeRect(100, 0, 100, 50);  // 6-yard box
    
    // Penalty Arc
    ctx.beginPath();
    ctx.arc(150, 150, 40, 0, Math.PI);
    ctx.stroke();

    // Penalty Spot
    ctx.beginPath();
    ctx.arc(150, 320, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Goal Post
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(80, 50);
    ctx.lineTo(80, 20);
    ctx.lineTo(220, 20);
    ctx.lineTo(220, 50);
    ctx.stroke();
    
    // Net
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    for(let i=85; i<=215; i+=10) {
        ctx.beginPath(); ctx.moveTo(i, 20); ctx.lineTo(i, 50); ctx.stroke();
    }
    for(let i=25; i<=45; i+=5) {
        ctx.beginPath(); ctx.moveTo(80, i); ctx.lineTo(220, i); ctx.stroke();
    }

    const { ball, gk, meter } = gameRef.current;

    // Goalkeeper
    ctx.fillStyle = '#e74c3c'; // Red jersey
    ctx.fillRect(gk.x - 12, 40, 24, 8); // Shoulders
    ctx.fillStyle = '#f1c40f'; // Gloves
    if (gk.isDiving) {
      if (gk.targetX < 150) {
        ctx.fillRect(gk.x - 20, 40, 8, 8); // Left glove extended
        ctx.fillRect(gk.x + 8, 40, 8, 8);
      } else {
        ctx.fillRect(gk.x - 8, 40, 8, 8);
        ctx.fillRect(gk.x + 12, 40, 8, 8); // Right glove extended
      }
    } else {
      ctx.fillRect(gk.x - 20, 40, 8, 8);
      ctx.fillRect(gk.x + 12, 40, 8, 8);
    }
    ctx.fillStyle = '#ffeaa7'; // Head
    ctx.beginPath();
    ctx.arc(gk.x, 34, 6, 0, Math.PI * 2);
    ctx.fill();

    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#000';
    for(let i=0; i<3; i++) {
        ctx.fillRect(ball.x - 2 + (i*2), ball.y - 2 + (i%2*2), 2, 2);
    }

    // Aim Meter Bottom UI
    if (meter.active) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(50, 360, 200, 15);
        ctx.fillStyle = '#e74c3c'; // Goal outside frame (miss)
        ctx.fillRect(50, 360, 25, 15);
        ctx.fillRect(225, 360, 25, 15);
        ctx.fillStyle = '#27ae60'; // High Goal chance
        ctx.fillRect(75, 360, 150, 15);
        ctx.fillStyle = '#f1c40f'; // Dead Center (easy save)
        ctx.fillRect(130, 360, 40, 15);

        // Meter cursor
        ctx.fillStyle = '#fff';
        ctx.fillRect(meter.x - 2, 355, 4, 25);
    }
  };

  const handleKick = () => {
    if (gameState !== 'PLAYING' || gameRef.current.waitingForNextShot) return;
    
    // Lock Meter
    gameRef.current.meter.active = false;
    const finalMeterX = gameRef.current.meter.x; // between 50 and 250
    gameRef.current.ball.targetX = 80 + ((finalMeterX - 50) / 200) * 140; // Map 50-250 to goal width 80-220
    
    // Determine GK Dive Logic
    const diveOptions = [100, 150, 200]; // Left, Center, Right
    const randomDive = diveOptions[Math.floor(Math.random() * diveOptions.length)];
    gameRef.current.gk.targetX = randomDive;
    gameRef.current.gk.isDiving = true;
    
    gameRef.current.ball.active = true;
    setGameState('KICKING');
    setMessage('');
  };

  const processResult = () => {
    const { ball, gk, meter } = gameRef.current;
    gameRef.current.waitingForNextShot = true;
    
    let isGoal = false;
    let msg = "";

    // Check if shot is off-target completely
    if (meter.x < 75 || meter.x > 225) {
        msg = "Missed the target entirely!";
    } else {
        // Did the GK save it?
        // GK width coverage is roughly 30px (x-15 to x+15)
        if (Math.abs(ball.targetX - gk.targetX) < 25) {
            msg = "WHAT A SAVE BY THE KEEPER!";
        } else {
            isGoal = true;
            msg = "GOAAAALLLL!";
        }
    }

    setMessage(msg);
    if (isGoal) setScore(prev => prev + 1);
    
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        setTimeout(() => setGameState('GAMEOVER'), 2000);
      } else {
        setTimeout(() => resetShotContext(), 2000);
      }
      return newAttempts;
    });
  };

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        const { meter, ball, gk } = gameRef.current;

        // Meter oscillation
        if (meter.active) {
            meter.x += 4 * meter.direction;
            if (meter.x >= 250) meter.direction = -1;
            if (meter.x <= 50) meter.direction = 1;
        }

        // Ball/GK Physics during KICKING
        if (gameState === 'KICKING') {
            ball.y -= 8;
            ball.x += (ball.targetX - ball.x) * 0.1; // ease into X
            
            // GK dives towards target
            gk.x += (gk.targetX - gk.x) * 0.15;
            
            // Reaches goal line
            if (ball.y <= 40) {
               setGameState('RESULT');
               processResult();
            }
        }
        draw(ctx);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleKick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: '#2ecc71' }}>⚽ Penalty Shootout</h2>
          <button onClick={onClose} style={styles.closeButton}>X</button>
        </div>

        <div style={styles.scoreboard}>
          <div style={styles.stat}>Goals: {score}</div>
          <div style={styles.stat}>Attempts: {attempts}/{MAX_ATTEMPTS}</div>
        </div>

        <div style={styles.canvasContainer} onClick={handleKick}>
          {gameState === 'START' && (
            <div style={styles.messageOverlay}>
              <h3>Welcome to the Pitch!</h3>
              <p>Spacebar to aim and kick.</p>
              <button style={styles.actionButton} onClick={startGame}>Take Penalty</button>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div style={styles.messageOverlay}>
              <h2>FULL TIME</h2>
              <p>Goals Scored: {score} out of {MAX_ATTEMPTS}</p>
              <p>{score >= 4 ? 'Clinical Finisher!' : score === 3 ? 'Not bad!' : 'Need more practice...'}</p>
              <button style={styles.actionButton} onClick={startGame}>Play Again</button>
            </div>
          )}

          <canvas ref={canvasRef} width={300} height={400} style={styles.canvas} />
          
          <div style={styles.statusText}>{message}</div>
        </div>
        
        <div style={styles.instructions}>
          <small>Hit green for corners. Yellow is risky!</small>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    background: '#1a1a1a', padding: '20px', borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)', border: '2px solid #333',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    color: '#fff', fontFamily: 'sans-serif', maxWidth: '400px', width: '100%'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', marginBottom: '15px', borderBottom: '1px solid #444', paddingBottom: '10px'
  },
  closeButton: {
    background: 'none', border: 'none', color: '#ff4757',
    fontSize: '20px', fontWeight: 'bold', cursor: 'pointer'
  },
  scoreboard: {
    display: 'flex', justifyContent: 'space-between', width: '100%',
    marginBottom: '15px', background: '#2c3e50', padding: '10px', borderRadius: '8px'
  },
  stat: {
    fontSize: '18px', fontWeight: 'bold', color: '#3498db'
  },
  canvasContainer: {
    position: 'relative', width: '300px', height: '400px',
    border: '3px solid #27ae60', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer'
  },
  canvas: { display: 'block' },
  messageOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', textAlign: 'center',
    padding: '20px', zIndex: 10
  },
  actionButton: {
    marginTop: '15px', padding: '10px 20px', background: '#27ae60',
    color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px',
    fontWeight: 'bold', cursor: 'pointer'
  },
  statusText: {
    position: 'absolute', top: '150px', left: '0', right: '0',
    textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: '20px',
    textShadow: '2px 2px 4px #000', zIndex: 5
  },
  instructions: { marginTop: '15px', color: '#aaa' }
};

export default FootballGame;
