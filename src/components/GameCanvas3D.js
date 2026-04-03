import React, { useEffect, useRef, memo, useState } from "react";
import init3DScene from "../game3d/Scene";
import ClubDetails from "./ClubDetails";
import FacultyDetails from "./FacultyDetails";
import DirectorDetails from "./DirectorDetails";
import BoardDetails from "./BoardDetails";
import StaffDetails from "./StaffDetails";
import CricketGame from "./CricketGame";
import FootballGame from "./FootballGame";

const GameCanvas3D = ({ user }) => {
  const ref = useRef();
  const isInitialized = useRef(false);
  const [showPrompt, setShowPrompt] = useState(null);
  const [showObjectives, setShowObjectives] = useState(null);
  const [activeIframeUrl, setActiveIframeUrl] = useState(null);
  const [activeInternalView, setActiveInternalView] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({ director: false, board: false, placements: false, website: false, staff: false, aims: false, faculty: false, techClub: false, culturalClub: false });

  useEffect(() => {
    if (!ref.current || isInitialized.current) return;
    
    // Pass callbacks down to sync overlapping html interface
    const callbacks = {
      onPrompt: (zone) => setShowPrompt(zone),
      onObjToggle: (show, zone) => { setShowObjectives(show ? zone : null); if (!show) { setActiveIframeUrl(null); setActiveInternalView(null); } }
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
          Press <b>E</b> to {
            showPrompt === 'cricket' ? 'Play Cricket Mini-Game' : 
            showPrompt === 'football' ? 'Play Football Mini-Game' :
            showPrompt === 'gallery' ? 'View Campus Gallery' :
            'view ' + (
              showPrompt === 'pi' ? 'Main Objectives' : 
              showPrompt === 'eblock' ? 'E-Block Objectives' : 
              showPrompt === 'chai' ? 'Chai Tapri Menu' : 
              showPrompt === 'juice' ? 'Juice Tapri Menu' :
              showPrompt === 'hblock' ? 'H Block Services' :
              showPrompt === 'gblock' ? 'G Block Info' :
              'B Block Info'
            )
          }
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
          ) : activeInternalView ? (
            <div style={{...styles.modalCard, width: '80%', height: '80%', display: 'flex', flexDirection: 'column'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h2 style={{margin: 0}}>
                  {activeInternalView === 'faculty' ? 'Faculty Details' : 
                   activeInternalView === 'director' ? 'Know Your Director' : 
                   activeInternalView === 'board' ? 'Board of Governors' : 
                   activeInternalView === 'staff' ? 'Know Your Staff' : 'Club Details'}
                </h2>
                <button onClick={() => setActiveInternalView(null)} style={styles.closeBtn}>Back to Tasks</button>
              </div>
              <div style={{flex: 1, overflow: 'hidden'}}>
                {activeInternalView === 'faculty' ? <FacultyDetails /> : 
                 activeInternalView === 'director' ? <DirectorDetails /> :
                 activeInternalView === 'board' ? <BoardDetails /> :
                 activeInternalView === 'staff' ? <StaffDetails /> :
                 <ClubDetails type={activeInternalView} />}
              </div>
            </div>
          ) : showObjectives === 'eblock' ? (
            <div style={styles.modalCard}>
              <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🏛️ E-Block Objectives</h2>
              <ul style={styles.gridContainer}>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.faculty} style={{marginRight: '8px'}}/>
                    <span>Faculty Details</span>
                  </div>
                  <button onClick={() => { setActiveInternalView("faculty"); setCompletedTasks(p => ({...p, faculty: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.techClub} style={{marginRight: '8px'}}/>
                    <span>Tech Club</span>
                  </div>
                  <button onClick={() => { setActiveInternalView('tech'); setCompletedTasks(p => ({...p, techClub: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.culturalClub} style={{marginRight: '8px'}}/>
                    <span>Cultural Club</span>
                  </div>
                  <button onClick={() => { setActiveInternalView('cultural'); setCompletedTasks(p => ({...p, culturalClub: true})); }} style={styles.taskBtn}>View</button>
                </li>
              </ul>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
              </div>
            </div>
          ) : showObjectives === 'chai' ? (
            <div style={{...styles.modalCard, position: 'absolute', bottom: '20px', right: '20px', maxWidth: '300px', padding: '20px', zIndex: 50}}>
              <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '8px', color: '#ffcc00', fontSize: '1.2rem' }}>☕ Chai Tapri Menu</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={styles.menuItem}><span>Hot Coffee</span> <span style={styles.price}>₹25</span></div>
                <div style={styles.menuItem}><span>Cold Coffee</span> <span style={styles.price}>₹40</span></div>
                <div style={styles.menuItem}><span>Biscuit</span> <span style={styles.price}>₹10</span></div>
                <div style={styles.menuItem}><span>Chocolate</span> <span style={styles.price}>₹20</span></div>
                <div style={styles.menuItem}><span>Toffee</span> <span style={styles.price}>₹5</span></div>
                <div style={styles.menuItem}><span>Ice Cream</span> <span style={styles.price}>₹30</span></div>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
              </div>
            </div>
          ) : showObjectives === 'juice' ? (
            <div style={{...styles.modalCard, position: 'absolute', bottom: '20px', right: '20px', maxWidth: '300px', padding: '20px', zIndex: 50}}>
              <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '8px', color: '#ff9900', fontSize: '1.2rem' }}>🧃 Juice Tapri Menu</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={styles.menuItem}><span>Mosambi Juice</span> <span style={styles.price}>₹40</span></div>
                <div style={styles.menuItem}><span>Orange Juice</span> <span style={styles.price}>₹50</span></div>
                <div style={styles.menuItem}><span>Kiwi Juice</span> <span style={styles.price}>₹60</span></div>
                <div style={styles.menuItem}><span>Pomegranate Juice</span> <span style={styles.price}>₹60</span></div>
                <div style={styles.menuItem}><span>Watermelon Juice</span> <span style={styles.price}>₹40</span></div>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
              </div>
            </div>
          ) : showObjectives === 'cricket' ? (
            <CricketGame onClose={() => setShowObjectives(null)} />
          ) : showObjectives === 'football' ? (
            <FootballGame onClose={() => setShowObjectives(null)} />
          ) : showObjectives === 'hblock' ? (
             <div style={styles.modalCard}>
               <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🏋️ H-Block Services</h2>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                 <div style={{...styles.gridCard, minHeight: '80px', justifyContent: 'center'}}><h3>GYM</h3></div>
                 <div style={{...styles.gridCard, minHeight: '80px', justifyContent: 'center'}}><h3>Music Room</h3></div>
                 <div style={{...styles.gridCard, minHeight: '80px', justifyContent: 'center'}}><h3>Dance Room</h3></div>
                 <div style={{...styles.gridCard, minHeight: '80px', justifyContent: 'center'}}><h3>Canteen</h3></div>
               </div>
               <div style={{ marginTop: '20px', textAlign: 'right' }}>
                 <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
               </div>
             </div>
          ) : showObjectives === 'gblock' ? (
             <div style={styles.modalCard}>
               <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🏢 G-Block Info</h2>
               <p style={{ fontSize: '18px', lineHeight: '1.5' }}>This building has the capacity of accommodating 600 people.</p>
               <div style={{ marginTop: '20px', textAlign: 'right' }}>
                 <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
               </div>
             </div>
          ) : showObjectives === 'bblock' ? (
             <div style={styles.modalCard}>
               <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>🏢 B-Block Info</h2>
               <p style={{ fontSize: '18px', lineHeight: '1.5' }}>4 Floor building.<br/>800 people capacity with up to 4-5 people per room.</p>
               <div style={{ marginTop: '20px', textAlign: 'right' }}>
                 <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
               </div>
             </div>
          ) : showObjectives === 'gallery' ? (
             <div style={{...styles.modalCard, width: '80%', height: '80%', display: 'flex', flexDirection: 'column'}}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                 <h2 style={{margin: 0}}>🖼️ Campus Gallery</h2>
                 <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
               </div>
               <iframe src="https://iiitdwd.ac.in/gallery/" style={{width: '100%', flex: 1, border: 'none', background: '#fff', borderRadius: '8px'}} title="Gallery View" />
             </div>
          ) : (
            <div style={styles.modalCard}>
              <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #444', paddingBottom: '10px' }}>📜 Main Objectives</h2>
              <ul style={styles.gridContainer}>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.director} style={{marginRight: '8px'}}/>
                    <span>Know your Director</span>
                  </div>
                  <button onClick={() => { setActiveInternalView("director"); setCompletedTasks(p => ({...p, director: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.board} style={{marginRight: '8px'}}/>
                    <span>Board of Governors</span>
                  </div>
                  <button onClick={() => { setActiveInternalView("board"); setCompletedTasks(p => ({...p, board: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.placements} style={{marginRight: '8px'}}/>
                    <span>Placements</span>
                  </div>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/placements/"); setCompletedTasks(p => ({...p, placements: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.website} style={{marginRight: '8px'}}/>
                    <span>IIIT Dharwad Website</span>
                  </div>
                  <button onClick={() => { setActiveIframeUrl("https://iiitdwd.ac.in/"); setCompletedTasks(p => ({...p, website: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.staff} style={{marginRight: '8px'}}/>
                    <span>Know Your Staff</span>
                  </div>
                  <button onClick={() => { setActiveInternalView("staff"); setCompletedTasks(p => ({...p, staff: true})); }} style={styles.taskBtn}>View</button>
                </li>
                <li style={styles.gridCard}>
                  <div style={styles.gridCardBox}>
                    <input type="checkbox" readOnly checked={completedTasks.aims} style={{marginRight: '8px'}}/>
                    <span>Access AIMS Portal</span>
                  </div>
                  <button onClick={() => { setActiveIframeUrl("https://aims.iiitdwd.ac.in/aims/"); setCompletedTasks(p => ({...p, aims: true})); }} style={styles.taskBtn}>View</button>
                </li>
              </ul>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setShowObjectives(null)} style={styles.closeBtn}>Close</button>
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
    width: '600px',
    maxWidth: '90%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
    border: '1px solid #333'
  },
  gridContainer: {
    paddingLeft: '0',
    listStyle: 'none',
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '15px'
  },
  gridCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #444',
    textAlign: 'center',
    minHeight: '100px'
  },
  gridCardBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    flexWrap: 'wrap'
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
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%'
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 15px',
    background: '#2a2a2a',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '1px solid #444'
  },
  price: {
    color: '#2ecc71'
  }
};

export default memo(GameCanvas3D);