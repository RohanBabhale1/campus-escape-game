import React, { useState } from 'react';

const techClubs = [
  { name: 'accelAIrate', image: 'https://iiitdwd.ac.in/images/ac_banner.png', desc: `The accelAIrate Club is dedicated to exploring the intersection of artificial intelligence, software, and hardware design. Our mission is to bridge the gap between AI software and specialized hardware to achieve optimized performance, especially on resource-constrained devices. Through research, hands-on projects, and collaborative learning, the club envisions pioneering innovations in AI hardware acceleration using cutting-edge technologies such as FPGA design, VLSI systems, neuromorphic architectures, and analog computing. By combining theoretical knowledge with practical experimentation, we aim to build the next generation of efficient, scalable, and sustainable AI systems. Members gain exposure to both AI algorithms and embedded hardware, developing skills that prepare them for careers and research in AI hardware co-design, chip development, and intelligent computing systems.` },
  { name: 'BlocSoc', image: 'https://iiitdwd.ac.in/images/Bloc_banner.png', desc: `BlocSoc is the official blockchain and Web3 society of IIIT Dharwad. We are a community of students, developers, and innovators passionate about exploring the potential of decentralized technologies. The club provides a collaborative platform to learn, build, and experiment with blockchain, cryptocurrencies, smart contracts, and decentralized applications (dApps). Through workshops, hackathons, research projects, and industry collaborations, we aim to make IIIT Dharwad a hub for blockchain innovation and thought leadership.` },
  { name: 'DSAI Society', image: 'https://iiitdwd.ac.in/images/DSAI_banner.png', desc: `The Data Science & Artificial Intelligence (DSAI) Society at IIIT Dharwad is where curiosity meets computation. We're a student-led community that doesn't just "use" AI tools — we dig deeper to understand how they actually work, from the math and theory that power them, to the code that brings them alive, to the real-world impact they create. Our goal is simple: learn by doing, explain by exploring, and innovate by questioning.` },
  { name: 'E cell', image: 'https://iiitdwd.ac.in/images/ECELL_banner.png', desc: `The Entrepreneurship Cell of IIIT Dharwad is a student-driven initiative that fosters creativity, innovation, and an entrepreneurial mindset on campus. We aim to nurture budding entrepreneurs by providing a platform to ideate, network, and transform ideas into impactful ventures. Through workshops, speaker sessions, competitions, and flagship events, E-Cell bridges the gap between students and the startup ecosystem. Our mission is to empower students to think beyond boundaries, embrace challenges, and become the next generation of leaders and innovators.` },
  { name: 'GDG IIIT Dharwad', image: 'https://iiitdwd.ac.in/images/GDG_banner.png', desc: `Google Developer Groups (GDG) IIIT Dharwad is a student-led community that brings together passionate developers, designers, and tech enthusiasts to learn, share, and build with Google technologies and beyond. Our goal is to foster innovation, collaboration, and growth by organizing hands-on workshops, hackathons, study jams, and tech talks that empower students to enhance their skills and stay industry-ready. At GDG IIIT Dharwad, we believe in learning by doing. Whether you're a beginner exploring coding for the first time or an experienced developer diving into advanced technologies like AI/ML, Cloud, Android, or Web, our community provides the right platform to grow, experiment, and connect with like-minded peers. By being part of GDG IIIT Dharwad, students not only gain technical expertise but also develop leadership, teamwork, and problem-solving skills—preparing them to make a real impact in the developer ecosystem.` },
  { name: 'GND_0 VLSI Club IIIT Dharwad', image: 'https://iiitdwd.ac.in/images/GND_banner.jpg', desc: `The VLSI and Semiconductor Club is a dynamic community at IIIT Dharwad that brings together students passionate about microelectronics, chip design, and integrated circuits. The club serves as a hub for exploring analog, digital, and mixed-signal circuit design, semiconductor technologies, and hardware innovation. Through hands-on workshops, technical seminars, project showcases, and collaborative study groups, we foster a culture of learning, experimentation, and innovation. Whether you are just beginning your journey in electronics or an advanced enthusiast, the club provides opportunities to deepen knowledge and gain practical skills in VLSI and semiconductor technology.` },
  { name: 'IEEE SB', image: 'https://iiitdwd.ac.in/images/IEEE_banner.png', desc: `The IEEE Student Branch at IIIT Dharwad is a vibrant community of innovators, technologists, and leaders passionate about advancing technology for humanity. The club actively encourages research and publications by guiding students in research methodology, paper writing, and IEEE formatting standards, as well as supporting them in drafting and submitting papers to reputed conferences and journals like IEEE Xplore. This blend of technical exploration and research culture equips students with the skills to innovate and contribute meaningfully to the global knowledge base.` },
  { name: 'InQuizitive', image: 'https://iiitdwd.ac.in/images/Inquiz_banner.jpeg', desc: `InQuizitive is the official quiz club of IIIT Dharwad, founded with the vision of establishing a prominent quizzing culture, nurturing intellectual curiosity, and promoting knowledge-sharing among students. The club organizes engaging quiz sessions on a wide variety of topics, including technology, science, sports, culture, and beyond, ensuring that every member finds a space to explore their interests. More than just a platform for competition, InQuizitive fosters collaboration, teamwork, and analytical thinking, creating an environment where learning is both challenging and enjoyable. Through active participation in events such as TCS TechBytes and other national-level quizzes, the club not only hones the skills of its members but also builds a culture of excellence and pride on campus. 🌟 Over the years, InQuizitive members have brought laurels to IIIT Dharwad with remarkable performances: 🥈 Aditya Raj (DSAI 2022–2026) secured 2nd place at the regionals in 2023. 🥈 Sujith (DSAI 2022–2026) achieved 2nd place at the regionals in 2024. 🏆 Aditya Raj (DSAI 2022–2026) won the regionals in 2025 and 🥈 placed 2nd in the state championship the same year. These achievements stand as a testament to the club’s commitment to competitive excellence and its mission to inspire students to push their intellectual boundaries.` },
  { name: 'IRIS', image: 'https://iiitdwd.ac.in/images/IRIS_banner.png', desc: `INNOVATION AND ROBOTICS CLUB` },
  { name: 'MSA IIIT Dharwad', image: 'https://iiitdwd.ac.in/images/msa_banner.jpg', desc: `Microsoft Student Ambassadors - IIIT Dharwad. The Microsoft Student Ambassadors Club at IIIT Dharwad is a vibrant community of tech enthusiasts, innovators, and leaders passionate about learning and sharing knowledge. Our mission is to empower students with cutting-edge skills, foster collaborative learning, and create opportunities for hands-on experience with Microsoft technologies and beyond. As part of the global Microsoft Learn Student Ambassadors program, our club organizes workshops, hackathons, coding challenges, and tech talks on trending technologies like Cloud, AI/ML, Web Development, and Open Source. We also provide career guidance, networking opportunities, and resources to help students grow into future tech leaders.` },
  { name: 'Quantum Computing Club', image: 'https://iiitdwd.ac.in/images/QC_Banner.jpg', desc: `The Quantum Computing Club at IIIT Dharwad is a student-led community for exploring the exciting world of quantum technologies. Through workshops, projects, and collaborations, we provide a space for curious minds to learn, experiment, and innovate together.` },
  { name: 'Return 0', image: 'https://iiitdwd.ac.in/images/R0_banner.jpeg', desc: `Return 0 is the premier competitive programming club at IIIT Dharwad, dedicated to fostering a culture of coding excellence. We provide a platform for students to hone problem-solving skills, engage in coding challenges, and prepare for prestigious competitions like ICPC and Meta Hacker Cup. Our community is built on collaboration, continuous learning, and the pursuit of coding mastery.` },
  { name: 'Techniosys', image: 'https://iiitdwd.ac.in/images/Technoyisis-Banner.webp', desc: `Techniosys is the Fun-Tech Club of IIIT Dharwad, dedicated to making technology engaging, creative, and accessible. Unlike domain-specific clubs, Techniosys is inherently versatile, each member's expertise contributes to the club's evolving identity. By embracing the diverse strengths of its members, Techniosys becomes a platform for creative exploration where technology is approached not just as a discipline, but as a form of recreation and innovation. The club is also the proud organizer of RUSH, IIIT Dharwad's premier annual e-sports event, which consistently attracts one of the largest footfalls on campus and has become a defining highlight of student life.` },
  { name: 'Velocity', image: 'https://iiitdwd.ac.in/images/V_banner.png', desc: `Club Velocity at IIIT Dharwad is the official development club that fosters a strong culture of building, coding, and innovation. It serves as a community-driven platform where students collaborate on real-world projects, share knowledge, and gain hands-on experience in software development. The club also organizes workshops, hackathons, and mentorship sessions to empower members with the skills needed to excel in the tech industry.` },
  { name: 'Vidkarya', image: 'https://iiitdwd.ac.in/images/VID_banner.png', desc: `Vidkarya is a student-led platform and community at IIIT Dharwad, created by passionate tech enthusiasts committed to empowering learners. It serves as a central hub for academic resources, hands-on projects, and peer collaboration. Through a repository of notes, PYQs, blogs, and curated study materials, Vidkarya simplifies the academic journey. What sets Vidkarya apart is its focus on fostering collaboration—connecting students, seniors, and alumni to share knowledge, projects, and opportunities. More than just a platform, Vidkarya is a growing ecosystem where students learn, build, and contribute together.` }
];

const culturalClubs = [
  { name: '440 Hz', image: 'https://iiitdwd.ac.in/images/440hz_banner.png', desc: `440Hz is the official music club of IIIT Dharwad, where passion for music meets creativity and collaboration. The club provides a platform for students to explore, perform, and experiment with diverse genres of music – from Indian classical to Western rock, from soulful vocals to energetic instrumentals. We aim to nurture musical talent, encourage collaboration among artists, and create unforgettable performances that resonate across the campus. Whether you are a trained musician or just someone who loves humming tunes, 440Hz welcomes you to be part of our rhythm.` },
  { name: 'Dynamight', image: 'https://iiitdwd.ac.in/images/dyn_banner.jpg', desc: `Dynamight, the Dance Club of our college, is a community where passion and rhythm come alive. We provide a platform for students to explore diverse dance forms, express creativity, and share the joy of performance. The club embodies energy, unity, and artistry, making dance an integral part of campus culture.` },
  { name: 'Flavorhood', image: 'https://iiitdwd.ac.in/images/flav_banner.jpg', desc: `Flavorhood is IIIT Dharwad's official food club. We're a community for food lovers, bringing students together to explore new tastes, share cooking skills, and enjoy delicious meals. From campus food fests and culinary workshops to fun cooking challenges and local food tours, Flavorhood is the perfect place to satisfy your cravings and connect with fellow food enthusiasts. Join us and let's make every meal a memorable experience!` },
  { name: 'Iridescence', image: 'https://iiitdwd.ac.in/images/ir_banner.jpg', desc: `The official media, photography, Videography, and Editing club of IIIT Dharwad, Iridescence, is where creativity meets expression. We capture moments, tell stories, and bring the vibrant campus life to light through photography, videography, design, and media production. From covering institute events and festivals to producing engaging content, the club blends technical skill with artistic vision. Beyond event coverage, Iridescence is a space for students to explore visual storytelling, experiment with creative ideas, and collaborate across disciplines. At its heart, Iridescence is about preserving memories, amplifying voices, and showcasing the unique spirit of our community.` },
  { name: 'LimeLight', image: 'https://iiitdwd.ac.in/images/lime_logo.jpg', desc: `Official Drama Club of IIIT Dharwad` },
  { name: 'Mosaic Club', image: 'https://iiitdwd.ac.in/images/mos_banner.jpg', desc: `Mosaic is the art club of IIIT Dharwad, dedicated to fostering creativity and self-expression among students. The club provides a platform for painting, sketching, crafts, digital art, and many other forms of art, while also contributing to campus life through wall paintings and event décor.` },
  { name: 'Out of Service', image: 'https://iiitdwd.ac.in/images/ous_banner.png', desc: `"Out of Service" is the Event Management Club for the cultural committee at IIIT Dharwad. We are responsible for planning, coordinating, and executing all cultural events. Our role includes managing logistics, ensuring smooth operations during events, and working closely with various clubs to integrate their contributions. We handle everything from scheduling to problem-solving, aiming to create memorable and successful events for our community.` },
  { name: 'Prabodhini', image: 'https://iiitdwd.ac.in/images/pra_banner.jpg', desc: `At Prabodhini, students can explore and engage with the wisdom of the Indian Knowledge System (IKS) in a meaningful and enjoyable way. The club brings IKS to life through ancient sciences, philosophies, arts, crafts, and traditions. We also host interactive sessions, workshops, and festival celebrations that build a strong sense of community. Above all, Prabodhini aims to stay rooted in our heritage while finding fresh, contemporary ways to carry it forward.` },
  { name: 'Zeitgeist', image: 'https://iiitdwd.ac.in/images/z_banner.png', desc: `Zeitgeist is the eloquent pulse of IIIT Dharwad, where literature, oratory, and discourse converge to forge voices that persuade, provoke, and inspire. Communication here is not expression alone, but the architecture of leadership.` }
];

export default function ClubDetails({ type }) {
  const isTech = type === 'tech';
  const clubs = isTech ? techClubs : culturalClubs;
  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <div style={styles.container}>
      {!selectedClub && (
        <>
          <h1 style={styles.header}>{isTech ? 'Technical Clubs' : 'Cultural Clubs'}</h1>
          {isTech ? (
            <p style={styles.intro}>Welcome to the world of technical innovation and excellence at IIIT Dharwad! Our technical clubs are the epicenter of hands-on learning, cutting-edge projects, and collaborative problem-solving. Whether you are a seasoned coder, a robotics enthusiast, or a curious beginner, these clubs offer a dynamic environment to explore your interests and develop your skills.</p>
          ) : (
            <p style={styles.intro}>Enter, fair traveler, into the grand tapestry of culture woven within IIIT Dharwad’s hallowed halls! Here, the quill dances with the soul, the stage breathes with fire, and melodies echo like whispers of the muses. From sonnets spun in moonlight to footfalls that shake the very earth, our cultural clubs are a realm where art and passion entwine.</p>
          )}
          
          <div style={styles.grid}>
            {clubs.map((club, i) => {
              const bgImage = 'url(' + club.image + ')';
              return (
                <div key={i} style={{
                  ...styles.card, 
                  backgroundImage: bgImage,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px',
                  border: '1px solid #444',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedClub(club)}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(10,10,10,0.5)',
                    zIndex: 0,
                    transition: 'background-color 0.3s'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <h3 
                      style={{...styles.cardTitle, margin: 0, textDecoration: 'underline', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,1)'}}
                    >
                      {club.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedClub && (
        <div style={styles.popup}>
           <div style={{
             backgroundImage: 'url(' + selectedClub.image + ')',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             height: '200px',
             borderRadius: '8px 8px 0 0',
             borderBottom: '2px solid #333'
           }}></div>
           <div style={{ padding: '20px' }}>
             <h2 style={{ color: '#3498db', marginTop: 0 }}>{selectedClub.name}</h2>
             <p style={{ color: '#ddd', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
               {selectedClub.desc}
             </p>
             <button onClick={() => setSelectedClub(null)} style={styles.backBtn}>Back to List</button>
           </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#1a1a1a',
    color: '#e0e0e0',
    height: '100%',
    overflowY: 'auto',
    borderRadius: '8px',
    boxSizing: 'border-box'
  },
  header: {
    color: '#fff',
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
    marginTop: 0
  },
  intro: {
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '25px',
    color: '#ccc'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    paddingBottom: '20px'
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
    transition: 'transform 0.2s, border 0.3s',
    minHeight: '120px'
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    transition: 'color 0.3s',
    textAlign: 'center'
  },
  popup: {
    background: '#222',
    borderRadius: '8px',
    border: '1px solid #444',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
    overflow: 'hidden'
  },
  backBtn: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '20px',
    width: '100%'
  }
};
