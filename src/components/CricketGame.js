import React, { useState, useEffect, useRef } from 'react';

const CricketGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  
  // Game States
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(0);
  const [message, setMessage] = useState('');
  
  const MAX_BALLS = 12;
  
  // Game Loop Refs
  const gameRef = useRef({
    ball: null,
    isSwinging: false,
    batAngle: 0,
    waitingForNextBall: false,
    timer: 0
  });

  const deliverBall = () => {
    const types = ['NORMAL', 'FAST', 'SPIN'];
    const type = types[Math.floor(Math.random() * types.length)];
    let speedY = 4;
    let speedX = 0;
    
    if (type === 'FAST') speedY = 7;
    if (type === 'SPIN') { speedY = 3.5; speedX = (Math.random() > 0.5 ? 1 : -1) * 1.5; }

    gameRef.current.ball = {
      x: 150,
      y: 20,
      radius: 6,
      speedY,
      speedX,
      type,
      active: true
    };
    gameRef.current.isSwinging = false;
    gameRef.current.batAngle = 0;
    gameRef.current.waitingForNextBall = false;
    setMessage(`Ball ${balls + 1}: ${type} Delivery!`);
  };

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setBalls(0);
    setMessage('Get Ready!');
    setTimeout(() => {
      deliverBall();
    }, 1000);
  };

  const draw = (ctx) => {
    // Draw Grass Stripes
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#4caf50' : '#45a049';
      ctx.fillRect(0, i * 50, 300, 50);
    }

    // Draw Pitch
    ctx.fillStyle = '#e6c28f'; // Lighter dry pitch color
    ctx.fillRect(100, 0, 100, 400);

    // Draw Wickets
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(135, 30, 4, 20);
    ctx.fillRect(148, 30, 4, 20);
    ctx.fillRect(161, 30, 4, 20);

    ctx.fillRect(135, 350, 4, 20);
    ctx.fillRect(148, 350, 4, 20);
    ctx.fillRect(161, 350, 4, 20);

    // Draw Batting Crease
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 330);
    ctx.lineTo(200, 330);
    ctx.stroke();

    const { ball, isSwinging } = gameRef.current;

    // Draw Ball
    if (ball && ball.active) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();
      
      // Ball Shadow/Trail detail
      ctx.beginPath();
      ctx.arc(ball.x, ball.y - 4, ball.radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      ctx.closePath();
    }

    // Draw 2D Batsman Person
    ctx.save();
    ctx.translate(170, 320); // Pivot point at player's body center
    
    if (isSwinging) {
      ctx.rotate(Math.PI / 1.8); // Swing forward across the pitch
    } else {
      ctx.rotate(-Math.PI / 12); // Resting stance angled slightly back towards wickets
    }

    // Body (Shoulders - vertical-ish oval representing top-down torso)
    ctx.fillStyle = '#3498db'; // Team Jersey Color
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helmet (Head)
    ctx.fillStyle = '#f1c40f'; // Yellow Helmet
    ctx.beginPath();
    ctx.arc(0, -2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Visor/Grill (facing towards Pitch / Left side)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-8, -6, 4, 8);

    // Arms
    ctx.strokeStyle = '#f39c12'; // Skin color
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // Front arm (Left arm)
    ctx.beginPath();
    ctx.moveTo(-4, -6); // Connect inside torso
    ctx.lineTo(-12, -10); // Connect to bat handle
    ctx.stroke();

    // Back arm (Right arm)
    ctx.beginPath();
    ctx.moveTo(4, 8); 
    ctx.lineTo(-12, -10);
    ctx.stroke();

    // Hands/Gloves
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.arc(-13, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // The Bat Handle
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(-16, -15, 6, 15);
    
    // The Bat Blade
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(-18, 0, 10, 35);

    ctx.restore();
  };

  const handleSwing = () => {
    if (gameState !== 'PLAYING' || gameRef.current.waitingForNextBall || !gameRef.current.ball?.active) return;
    
    const ball = gameRef.current.ball;
    gameRef.current.isSwinging = true;
    
    // Timing Logic (Sweet spot is around Y = 330)
    const distance = ball.y - 330;
    
    let outcomeRuns = 0;
    let isWicket = false;
    let msg = "";

    if (Math.abs(distance) < 15) {
      // Perfect Timing
      outcomeRuns = Math.random() > 0.5 ? 6 : 4;
      msg = `Perfect Timing! ${outcomeRuns} RUNS!`;
    } else if (distance < -15 && distance > -40) {
      // Early
      outcomeRuns = Math.random() > 0.5 ? 2 : 1;
      msg = `Early Swing. ${outcomeRuns} Runs.`;
    } else {
      // Late or Way Early -> Edge / Miss
      isWicket = true;
      msg = distance > 15 ? 'Too Late! BOWLED!' : 'Mistimed! CAUGHT OUT!';
    }

    ball.active = false;
    processResult(outcomeRuns, isWicket, msg);
  };

  const processResult = (runs, isWicket, msg) => {
    gameRef.current.waitingForNextBall = true;
    setMessage(msg);
    setScore(prev => prev + runs);
    setBalls(prev => {
      const newBalls = prev + 1;
      if (isWicket || newBalls >= MAX_BALLS) {
        setTimeout(() => {
          setGameState('GAMEOVER');
        }, 1500);
      } else {
        setTimeout(() => {
          deliverBall();
        }, 1500);
      }
      return newBalls;
    });
  };

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        if (gameState === 'PLAYING') {
          const { ball, waitingForNextBall } = gameRef.current;
          
          // Physics update
          if (ball && ball.active && !waitingForNextBall) {
            ball.y += ball.speedY;
            ball.x += ball.speedX;

            // Bounce effect for Spin
            if (ball.type === 'SPIN' && ball.y > 150 && ball.y < 155) {
              ball.speedX = ball.speedX * -0.5; // Turn
            }

            // Missed the ball automatically
            if (ball.y >= 350) {
               ball.active = false;
               processResult(0, true, "Missed it! BOWLED!");
            }
          }
        }
        draw(ctx);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  // Keyboard shortcut for swing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleSwing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: '#f1c40f' }}>🏏 Little Master Cricket</h2>
          <button onClick={onClose} style={styles.closeButton}>X</button>
        </div>

        <div style={styles.scoreboard}>
          <div style={styles.stat}>Score: {score}</div>
          <div style={styles.stat}>Balls: {balls}/{MAX_BALLS}</div>
          <div style={styles.stat}>SR: {balls > 0 ? ((score/balls)*100).toFixed(0) : 0}</div>
        </div>

        <div style={styles.canvasContainer} onClick={handleSwing}>
          {gameState === 'START' && (
            <div style={styles.messageOverlay}>
              <h3>Welcome to the Nets!</h3>
              <p>Wait for the ball to reach the white line.</p>
              <p>Spacebar or Tap to Swing.</p>
              <button style={styles.actionButton} onClick={startGame}>Play Now</button>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div style={styles.messageOverlay}>
              <h2>{balls < MAX_BALLS ? "OUT!" : "INNINGS OVER"}</h2>
              <p>Final Score: {score}</p>
              <button style={styles.actionButton} onClick={startGame}>Play Again</button>
            </div>
          )}

          <canvas 
            ref={canvasRef} 
            width={300} 
            height={400} 
            style={styles.canvas} 
          />
          
          <div style={styles.statusText}>{message}</div>
        </div>
        
        <div style={styles.instructions}>
          <small>Timing: Perfect (4s/6s), Early/Late (1s/2s), Miss (Wicket)</small>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#1a1a1a',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    border: '2px solid #333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'sans-serif',
    maxWidth: '400px',
    width: '100% maxWidth: 90%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '15px',
    borderBottom: '1px solid #444',
    paddingBottom: '10px'
  },
  closeButton: {
    background: 'none', border: 'none', color: '#ff4757',
    fontSize: '20px', fontWeight: 'bold', cursor: 'pointer'
  },
  scoreboard: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '15px',
    background: '#2c3e50',
    padding: '10px',
    borderRadius: '8px'
  },
  stat: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1dd1a1'
  },
  canvasContainer: {
    position: 'relative',
    width: '300px',
    height: '400px',
    border: '3px solid #f1c40f',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  canvas: {
    display: 'block'
  },
  messageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    zIndex: 10
  },
  actionButton: {
    marginTop: '15px',
    padding: '10px 20px',
    background: '#f1c40f',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  statusText: {
    position: 'absolute',
    top: '10px',
    left: '0',
    right: '0',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    textShadow: '1px 1px 2px #000',
    zIndex: 5
  },
  instructions: {
    marginTop: '15px',
    color: '#aaa'
  }
};

export default CricketGame;
