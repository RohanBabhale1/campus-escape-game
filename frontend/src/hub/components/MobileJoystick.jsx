import React, { useEffect, useRef, useState } from 'react';

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

const JOYSTICK_RADIUS = 60;
const INNER_RADIUS = 28;

// Maps virtual joystick direction to WASD key simulation via a global keystate
const virtualKeys = { w: false, a: false, s: false, d: false };
// We dispatch synthetic KeyboardEvents so Scene.jsx's listeners work too
const dispatchKey = (key, down) => {
  if (virtualKeys[key] === down) return;
  virtualKeys[key] = down;
  const eventType = down ? 'keydown' : 'keyup';
  window.dispatchEvent(new KeyboardEvent(eventType, { key, bubbles: true }));
};

export default function MobileJoystick() {
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [stick, setStick] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const touchId = useRef(null);

  useEffect(() => {
    setShow(isMobile());
    const onResize = () => setShow(isMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!show) return null;

  const handleTouchStart = (e) => {
    const touch = e.changedTouches[0];
    touchId.current = touch.identifier;
    setOrigin({ x: touch.clientX, y: touch.clientY });
    setStick({ x: 0, y: 0 });
    setActive(true);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier !== touchId.current) continue;
      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamped = Math.min(dist, JOYSTICK_RADIUS);
      const angle = Math.atan2(dy, dx);
      const sx = Math.cos(angle) * clamped;
      const sy = Math.sin(angle) * clamped;
      setStick({ x: sx, y: sy });

      // Convert angle to WASD — threshold 0.4 of radius
      const threshold = JOYSTICK_RADIUS * 0.35;
      dispatchKey('w', sy < -threshold);
      dispatchKey('s', sy > threshold);
      dispatchKey('a', sx < -threshold);
      dispatchKey('d', sx > threshold);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier !== touchId.current) continue;
      touchId.current = null;
      setActive(false);
      setStick({ x: 0, y: 0 });
      ['w', 'a', 's', 'd'].forEach(k => dispatchKey(k, false));
      e.preventDefault();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 36,
        left: 36,
        zIndex: 200,
        userSelect: 'none',
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer ring */}
      <div style={{
        width: JOYSTICK_RADIUS * 2,
        height: JOYSTICK_RADIUS * 2,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.45)',
        border: '2px solid rgba(255,255,255,0.25)',
        position: 'relative',
        boxShadow: '0 0 18px rgba(0,200,255,0.2)',
      }}>
        {/* Inner stick */}
        <div style={{
          width: INNER_RADIUS * 2,
          height: INNER_RADIUS * 2,
          borderRadius: '50%',
          background: active ? 'rgba(0,200,255,0.7)' : 'rgba(255,255,255,0.45)',
          border: '2px solid rgba(255,255,255,0.6)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${stick.x}px), calc(-50% + ${stick.y}px))`,
          transition: active ? 'none' : 'transform 0.15s ease-out',
          boxShadow: active ? '0 0 14px rgba(0,200,255,0.7)' : 'none',
        }} />
      </div>
      {/* E interact button */}
      <div
        style={{
          position: 'absolute',
          right: -70,
          bottom: 0,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(0,200,255,0.5)',
          border: '2px solid rgba(0,200,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
          boxShadow: '0 0 12px rgba(0,200,255,0.4)',
        }}
        onTouchStart={(e) => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
          e.preventDefault();
        }}
        onTouchEnd={(e) => {
          window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true }));
          e.preventDefault();
        }}
      >
        E
      </div>
    </div>
  );
}
