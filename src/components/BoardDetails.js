import React, { useState } from 'react';

const boardMembers = [
  {
    "name": "Mr. Jalaj Dani",
    "desc": "Chairperson, IIIT Dharwad",
    "image": "https://iiitdwd.ac.in/images/jalaj_dani.jpeg"
  },
  {
    "name": "Smt. Saumya Gupta",
    "desc": "Joint Secretary (TE), Ministry of Education, Government of India",
    "image": "https://iiitdwd.ac.in/images/saumya_gupta.jpg"
  },
  {
    "name": "Shri M. N. Vidyashankar, IAS",
    "desc": "President, IESA & Former Additional Chief Secretary to Government of Karnataka",
    "image": "https://iiitdwd.ac.in/images/m_n_vidyashankar.jpg"
  },
  {
    "name": "Dr. Manjula N., IAS",
    "desc": "Secretary to Government Department of Electronics, IT, Biotech, and Science & Tech, GoK",
    "image": "https://iiitdwd.ac.in/images/Manjula_N.jpeg"
  },
  {
    "name": "Smt. K. Ratna Prabha",
    "desc": "Former Chief Secretary, Government of Karnataka",
    "image": "https://iiitdwd.ac.in/images/Smt._Ratna_Prabha__IAS__Former_Chief_Secetary.jpg"
  },
  {
    "name": "Prof. Uday B. Desai",
    "desc": "Former Director, IIT Hyderabad",
    "image": "https://iiitdwd.ac.in/images/uday_b_desai.jpg"
  },
  {
    "name": "Dr. Bhaskar Ghosh",
    "desc": "Former Chief Strategy Officer at Accenture",
    "image": "https://iiitdwd.ac.in/images/bhaskar-ghosh_-_Accenture.jpg"
  },
  {
    "name": "Sri. Raghunandan Murthy, IAS",
    "desc": "Managing Director, KEONICS",
    "image": "https://iiitdwd.ac.in/images/Shri._Raghunandan_Murthy__IAS__MD__Kenoics.jfif"
  },
  {
    "name": "Prof. Pankaj Chandra",
    "desc": "Vice Chancellor, Ahmedabad University",
    "image": "https://iiitdwd.ac.in/images/pankaj_chandra.jpg"
  },
  {
    "name": "Prof. S. Sadagopan",
    "desc": "Former Director, IIIT Bengaluru",
    "image": "https://iiitdwd.ac.in/images/s_sadagopan.jpg"
  },
  {
    "name": "Prof. H. P. Khincha",
    "desc": "Former Vice Chancellor, VTU and Professor, IISc, Bengaluru",
    "image": "https://iiitdwd.ac.in/images/h_p_khincha.jpg"
  },
  {
    "name": "Prof. Venkappayya R. Desai",
    "desc": "Director, IIT Dharwad",
    "image": "https://iiitdwd.ac.in/images/venkappayya_r_desai.jpeg"
  },
  {
    "name": "Prof. S. R. Mahadeva Prasanna",
    "desc": "Director, IIIT Dharwad",
    "image": "https://iiitdwd.ac.in/images/s_r_mahadeva_prasanna.jpg"
  }
];

export default function BoardDetails() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={styles.container}>
      {!selectedItem && (
        <>
          <h1 style={styles.header}>Board of Governors</h1>
          <p style={styles.intro}>The distinguished members of the Board of Governors at IIIT Dharwad.</p>
          
          <div style={styles.grid}>
            {boardMembers.map((member, i) => {
              const bgImage = 'url(' + member.image + ')';
              return (
                <div key={i} style={{
                  ...styles.card, 
                  backgroundImage: bgImage,
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px',
                  border: '1px solid #444',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedItem(member)}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(10,10,10,0.6)',
                    zIndex: 0,
                    transition: 'background-color 0.3s'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <h3 style={{...styles.cardTitle, margin: '0 0 5px 0', textDecoration: 'underline', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,1)'}}>
                      {member.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedItem && (
        <div style={styles.popup}>
           <div style={{
             backgroundImage: 'url(' + selectedItem.image + ')',
             backgroundSize: 'contain',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             backgroundColor: '#111',
             height: '300px',
             borderRadius: '8px 8px 0 0',
             borderBottom: '2px solid #333'
           }}></div>
           <div style={{ padding: '30px', textAlign: 'center' }}>
             <h2 style={{ color: '#3498db', marginTop: 0, marginBottom: '15px', fontSize: '24px' }}>{selectedItem.name}</h2>
             <h3 style={{ color: '#eee', marginTop: 0, marginBottom: '30px', fontWeight: 'normal', fontSize: '16px' }}>{selectedItem.desc}</h3>
             
             <button onClick={() => setSelectedItem(null)} style={styles.backBtn}>Back to List</button>
           </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', background: '#1a1a1a', color: '#e0e0e0', height: '100%', overflowY: 'auto', borderRadius: '8px', boxSizing: 'border-box' },
  header: { color: '#fff', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 },
  intro: { fontSize: '15px', lineHeight: '1.6', marginBottom: '25px', color: '#ccc' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', paddingBottom: '20px' },
  card: { borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'transform 0.2s, border 0.3s', minHeight: '220px' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', transition: 'color 0.3s', textAlign: 'center' },
  popup: { background: '#222', borderRadius: '8px', border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', overflow: 'hidden', marginTop: '20px' },
  backBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', maxWidth: '300px' }
};
