import React, { useState } from 'react';

const staffMembers = [
  {
    "name": "Staff",
    "image": "https://iiitdwd.ac.in/_next/static/media/campus_0.ceaad1dc.webp",
    "desc": ""
  },
  {
    "name": "Mr. Ashwin Hiremath",
    "image": "https://iiitdwd.ac.in/images/ashwin_hiremath.jpeg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Ms. Arya Katwe",
    "image": "https://iiitdwd.ac.in/images/arya_katwe.jpg",
    "desc": "P.A to Director"
  },
  {
    "name": "Shri. Ayush Sharma",
    "image": "https://iiitdwd.ac.in/images/AyushSharma.jpeg",
    "desc": "Assistant Executive Engineer (AEE)"
  },
  {
    "name": "Mr. Naveen Shirahatti",
    "image": "https://iiitdwd.ac.in/images/naveen_shirahatti.jpeg",
    "desc": "Assistant Sports Coach"
  },
  {
    "name": "Mrs. Neeta Patil",
    "image": "https://iiitdwd.ac.in/images/neeta_patil.jpeg",
    "desc": "Junior Technical Assistant"
  },
  {
    "name": "Ms. Pooja Akki",
    "image": "https://iiitdwd.ac.in/images/pooja_akki.jpg",
    "desc": "Junior Technical Assistant"
  },
  {
    "name": "Mr. Prasad Pulakeshi Kalal",
    "image": "https://iiitdwd.ac.in/images/prasad_pulakeshi_kalal.jpg",
    "desc": "Junior Technical Assistant"
  },
  {
    "name": "Mr. Raghvendra H",
    "image": "https://iiitdwd.ac.in/images/raghvendra_h.jpeg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mr. Ravi B Vitlapur",
    "image": "https://iiitdwd.ac.in/images/ravi_b_vitlapur.jpg",
    "desc": "Senior Assistant Registrar"
  },
  {
    "name": "Mrs. Reshma Pyatishettar",
    "image": "https://iiitdwd.ac.in/images/reshma_pyatishettar.jpg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mr. Sagar Kolekar",
    "image": "https://iiitdwd.ac.in/images/sagar_kolekar.jpeg",
    "desc": "Senior Library Information Assistant"
  },
  {
    "name": "Mr. Sameer Desai",
    "image": "https://iiitdwd.ac.in/images/sameer_desai.jpeg",
    "desc": "Technical Assistant"
  },
  {
    "name": "Dr. Sangamesh Patil",
    "image": "https://iiitdwd.ac.in/images/sangamesh_patil.jpg",
    "desc": "Medical Officer"
  },
  {
    "name": "Ms. Shalini Kotur",
    "image": "https://iiitdwd.ac.in/images/shalini_kotur.jpeg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mrs. Suma Shetty",
    "image": "https://iiitdwd.ac.in/images/suma_shetty.jpeg",
    "desc": "Junior Superintendent - HRM"
  },
  {
    "name": "Mr. Sunil Kulkarni",
    "image": "https://iiitdwd.ac.in/images/sunil_kulkarni.jpg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mrs. Swati Math",
    "image": "https://iiitdwd.ac.in/images/swati_math.jpeg",
    "desc": "Superintendent - Accounts"
  },
  {
    "name": "Mr. Ujwal Doddamani",
    "image": "https://iiitdwd.ac.in/images/ujwal_doddamani.jpg",
    "desc": "Student life coordinator"
  },
  {
    "name": "Mr. Yallappa Kuri",
    "image": "https://iiitdwd.ac.in/images/yallappa_kuri.JPG",
    "desc": "Office Asst/Attender"
  },
  {
    "name": "Mr. Prashant Govindappa Dokkannavar",
    "image": "https://iiitdwd.ac.in/images/Prashant_Govindappa_Dokkannavar.png",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mr. Sachin A",
    "image": "https://iiitdwd.ac.in/images/0123_sachin_-_Sachin_A.jpg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Veerabhadrayya S Hiremath",
    "image": "https://iiitdwd.ac.in/images/5_-_Vs_Hiremath.jpg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Ms. Kiran Mallikarjun Otageri",
    "image": "https://iiitdwd.ac.in/images/Kiran_Mallikarjun_Otageri.jpg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mr. Mallikarjun",
    "image": "https://iiitdwd.ac.in/images/Mallikarjun_IIIT_Dharwad.jpeg",
    "desc": "Junior Assistant"
  },
  {
    "name": "Mr. Bhagavath Jai Singh",
    "image": "https://iiitdwd.ac.in/images/Bhagavath_Jai_Singh.jpg",
    "desc": "Junior Technician"
  },
  {
    "name": "Mr. AJITHKUMAR B",
    "image": "https://iiitdwd.ac.in/images/Ajithkumar_B.jpg",
    "desc": "Junior Assistant"
  },
  {
    "name": "ACADEMICS",
    "image": "https://iiitdwd.ac.in/_next/static/media/FooterLogo.a3117e7b.webp",
    "desc": "IIIT Dharwad Campus, Ittigatti Road, Near Sattur Colony, Dharwad 580009"
  }
];

export default function StaffDetails() {
  const [selectedStaff, setSelectedStaff] = useState(null);

  return (
    <div style={styles.container}>
      {!selectedStaff && (
        <>
          <h1 style={styles.header}>Know Your Staff</h1>
          <p style={styles.intro}>Meet the dedicated non-teaching staff members of IIIT Dharwad who keep the campus running smoothly.</p>
          
          <div style={styles.grid}>
            {staffMembers.map((staff, i) => {
              const bgImage = 'url(' + staff.image + ')';
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
                onClick={() => setSelectedStaff(staff)}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(10,10,10,0.5)',
                    zIndex: 0,
                    transition: 'background-color 0.3s'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <h3 style={{...styles.cardTitle, margin: 0, textDecoration: 'underline', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,1)'}}>
                      {staff.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedStaff && (
        <div style={styles.popup}>
           <div style={{
             backgroundImage: 'url(' + selectedStaff.image + ')',
             backgroundSize: 'contain',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             backgroundColor: '#111',
             height: '300px',
             borderRadius: '8px 8px 0 0',
             borderBottom: '2px solid #333'
           }}></div>
           <div style={{ padding: '20px', textAlign: 'center' }}>
             <h2 style={{ color: '#3498db', marginTop: 0, marginBottom: '5px' }}>{selectedStaff.name}</h2>
             <h3 style={{ color: '#aaa', marginTop: 0, marginBottom: '20px', fontWeight: 'normal' }}>{selectedStaff.desc}</h3>
             
             <button onClick={() => setSelectedStaff(null)} style={styles.backBtn}>Back to List</button>
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
  card: { borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', transition: 'transform 0.2s, border 0.3s', minHeight: '200px' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', transition: 'color 0.3s', textAlign: 'center' },
  popup: { background: '#222', borderRadius: '8px', border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', overflow: 'hidden' },
  backBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }
};
