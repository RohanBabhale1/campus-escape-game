import React, { useEffect, useRef, memo, useState } from "react";
import init3DScene from "../game3d/Scene";

const GameCanvas3D = ({ user }) => {
  const ref = useRef();
  const isInitialized = useRef(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [activeIframeUrl, setActiveIframeUrl] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({ director: false, board: false, placements: false, website: false, staff: false, aims: false });

  useEffect(() => {
    if (!ref.current || isInitialized.current) return;
    
    // Pass callbacks down to sync overlapping html interface
    const callbacks = {
      onPrompt: (show) => setShowPrompt(show),
      onObjToggle: (show) => { setShowObjectives(show); if (!show) setActiveIframeUrl(null); }
    };

    const cleanup = init3DScene(ref.current, user, callbacks);
    isInitialized.current = true;

    return () => {
      if (cleanup) {
        cleanup();
        isInitialized.current = false;
      }
    };
  }, [user]);

  return (
    <div style={{ width: "100%", height: "100%", position: 'relative' }}>
      <div 
        ref={ref} 
        style={{ 
          width: "100%", 
          height: "100%", 
          background: "#000",
          touchAction: 'none' 
        }} 
      />

      {showPrompt && !showObjectives && (
        <div style={styles.prompt}>
          Press <b>E</b> to view Main Objectives
        </div>
      )}

      {showObjectives && (
        <div style={styles.modalOverlay}>
          {activeIframeUrl ? (
            <div style={{...styles.modalCard, width: '80%', height: '80%', display: 'flex', flexDirection: 'column'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h2 style={{margin: 0}}>Viewing Task</h2>
                <button onClick={() => setActiveIframeUrl(null)} style={styles.closeBtn}>Back to Tasks</button>
              </div>
              <iframe src={activeIframeUrl} style={{width: '100%', flex: 1, border: 'none', background: '#fff', borderRadius: '8px'}} title="Task View" />
            </div>
          ) : (
            <div style={styles.modalCard}>
              <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>📜 Main Objectives</h2>
              <ul style={{ paddingLeft: '0', listStyle: 'none', lineHeight: '2.2', margin: 0 }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span><input type="checkbox" readOnly checked={completedTasks.director} style={{marginRight: '10px'}}/> Know your Director</span>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/director/"); setCompletedTasks(p => ({...p, director: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span><input type="checkbox" readOnly checked={completedTasks.board} style={{marginRight: '10px'}}/> Board of Governors</span>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/governing-bodies/board/"); setCompletedTasks(p => ({...p, board: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span><input type="checkbox" readOnly checked={completedTasks.placements} style={{marginRight: '10px'}}/> Placements</span>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/placements/"); setCompletedTasks(p => ({...p, placements: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span><input type="checkbox" readOnly checked={completedTasks.website} style={{marginRight: '10px'}}/> IIIT Dharwad Website</span>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/"); setCompletedTasks(p => ({...p, website: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span><input type="checkbox" readOnly checked={completedTasks.staff} style={{marginRight: '10px'}}/> Know Your Staff</span>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/staff/"); setCompletedTasks(p => ({...p, staff: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span><input type="checkbox" readOnly checked={completedTasks.aims} style={{marginRight: '10px'}}/> Access the AIMS Portal</span>
                  <button onClick={() => { setActiveIframeUrl("https://aims.iiitdwd.ac.in/aims/"); setCompletedTasks(p => ({...p, aims: true})); }} style={styles.taskBtn}>View</button>
                </li>
              </ul>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setShowObjectives(false)} style={styles.closeBtn}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  prompt: {
    position: 'absolute',
    bottom: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.8)',
    color: 'yellow',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    border: '2px solid yellow',
    textTransform: 'uppercase'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  modalCard: {
    background: '#1a1a1a',
    color: '#fff',
    padding: '30px',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
    border: '1px solid #333'
  },
  closeBtn: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  taskBtn: {
    background: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};

export default memo(GameCanvas3D);