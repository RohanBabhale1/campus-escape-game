import React from 'react';

const directorData = {
  name: "Prof. S. R. Mahadeva Prasanna",
  desc: "Director, IIIT Dharwad",
  image: "https://iiitdwd.ac.in/images/SRMahadevaPrasanna.jpg",
  email: "director@iiitdwd.ac.in",
  youtube: "https://www.youtube.com/@profmahadevaprasanna",
  dept: "Data Science and Artificial Intelligence",
  phd: "Ph.D. (IIT Madras)",
  bio: [
    "S. R. Mahadeva Prasanna is a recipient of the National Award for Teachers 2023 from the honorable President of India Smt. Droupadi Murmu. He is working as Director, IIIT Dharwad on leave from IIT Dharwad from May 2024 and as Director (Additional Charge), IIIT Sri City, AP from August 2025. He is Professor in the Dept. of Data Science and Artificial Intelligence at IIIT Dharwad. He is also Professor in the Dept. of Electrical, Electronics and Communication (EECE) at IIT Dharwad. He was Dean(Faculty Welfare) at IIT Dharwad before taking charge of Director at IIIT Dharwad. He was earlier Professor in the Dept. of Electronics and Electrical Engineering and Dean (Research & Development), IIT Guwahati. He earned his PhD from IIT Madras in 2004, MTech from NITK Surathkal (then KREC Surathkal) in 1997 and BE from SSIT Tumakuru in 1994. He teaches signal processing, speech processing, artificial intelligence, machine learning and deep learning related courses. His research interests are in speech processing. He has supervised 30 PhD research scholars in the areas of speech and handwriting processing.",
    "Currently 10 scholars are working for their PhD / MS / MTech(R) degrees. He has published over 125 journal articles and 230 conference articles in reputed national and international journals and conferences. He has executed large volume externally funded projects from public and private funding agencies. He is also a consultant for many industries working in the niche technology areas, especially, speech technology. On the academic administration front, at IIT Guwahati he was faculty-in-charge, counseling cell, chairman, students' welfare board, organizing vice-chairman, GATE 2010, Chairman, GATE 2011, Associate Dean (Research and Development) and Dean (Research & Development). At IIT Dharwad, he was Dean (Faculty Welfare) and Dean (Research & Development) from July 2017 till March 2023. From March 2023 till April 2024, he continued as Dean (Faculty Welfare). He also served IIT Dharwad on different committees towards setting up the institute of national importance in Dharwad, Karnataka.",
    "Welcome to Dharwad city also known as ‘Vidyakashi’ for its rich academic ambience. Dharwad is an education city with nine Universities in and around. IIIT Dharwad is proud to be in the midst of these great universities. It will derive benefits by collaborating with these universities from their rich experience and knowledge. It will in turn contribute by offering academic and research programs in information technology, computer science, electronics and communication, data science and artificial intelligence areas. There is a saying about Dharwad, ‘if you throw a stone in Dharwad, it will most likely fall on the house of a teacher or literary person or musician’. To add to this, ‘if you miss an address, most probably you will end up at the entrance gate of one of the universities’. Such a great academic place is Dharwad city. For more than a century, it has been the dream destination for education, literature and music pursuits. This ecosystem is the fertile ground on which IIIT Dharwad has started its journey in 2015. This is a noble initiative of Government of India (GoI), Government of Karnataka (GoK) and industrial partner KEONICS. IIIT Dharwad has made excellent progress and completed its first phase of journey. It is ready to embark on its next phase. Since we have our own permanent campus with necessary infrastructure, the next phase of five years is expected to witness an exponential growth.",
    "IIIT Dharwad will go all out to establish industry-academia, and national and international academic collaborations. Being an higher education institute of the country established in North Karnataka will be sensitive to the social ecosystem in the neighborhood and would like to fulfill its academic-social responsibility. Information technology, computer science, electronics and communication, data science and artificial intelligence are the niche technology areas for the 21st century and hence IIITs are the most sought after higher education technology institutes. With highly qualified faculty in partnership with industry and academia from India and abroad would like to help the higher education landscape and growth of high tech industries. The benefit of aimed collaboration is not only for IIIT Dharwad, but also for all the academic institutes in the neighborhood, specifically North Karnataka. If you want to experience an exciting journey for undergraduate, post graduate and research degrees in Information technology, computer science, electronics and communication, data science and artificial intelligence, then you should seriously consider joining IIIT Dharwad. Please read more information on the official website and official social media platforms of the institute. If you want to know more about the campus facilities, admission process and opportunities, you are most welcome to contact respective divisions or units of the institute or visit the institute and interact with us.",
    "IIIT Dharwad is a well thought out public private partnership (PPP) university model of the country where the institute needs to generate its own revenue to bring stability, sustainability and growth. Therefore apart from academic programs, we are looking for industry-academia collaborations. We are in the process of starting a tech park that will have space for startups, industrial research centers, skilling institutes, training academies for teachers in frontier technology areas and the future of learning in the form of digital and online. For our young generation, the entire world is a family (Vasudhaiva Kutumbakam) and we want IIIT Dharwad students to get trained and move onto premier institutes and organizations across the globe and lead them. To create an ecosystem for the same, we are looking for national and international collaborations. To execute our growth plan, we need to augment our infrastructure and look for help from a big hearted community for the cause of setting up a vibrant education and learning ecosystem. A special appeal to the global community, Indian diaspora, specifically from North Karnataka in India and abroad to come forward and contribute to this great institute in the making in terms of Tanu-Mana-Dhana! If you want to know more about how you can help IIIT Dharwad, please contact me at director@iiitdwd.ac.in"
  ]
};

export default function DirectorDetails() {
  return (
    <div style={styles.container}>
        <h1 style={styles.header}>Know your Director</h1>
        
        <div style={styles.popup}>
           <div style={{
             backgroundImage: 'url(' + directorData.image + ')',
             backgroundSize: 'contain',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             backgroundColor: '#111',
             height: '350px',
             borderRadius: '8px 8px 0 0',
             borderBottom: '2px solid #333'
           }}></div>
           <div style={{ padding: '30px', textAlign: 'center' }}>
             <h2 style={{ color: '#3498db', marginTop: 0, marginBottom: '10px', fontSize: '28px' }}>{directorData.name}</h2>
             <h3 style={{ color: '#aaa', marginTop: 0, marginBottom: '25px', fontWeight: 'normal', fontSize: '18px' }}>{directorData.desc}</h3>
             
             <div style={{ textAlign: 'left', background: '#2a2a2a', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{margin: '10px 0', color: '#eee', fontSize: '16px'}}><strong>Department:</strong> {directorData.dept}</p>
                <p style={{margin: '10px 0', color: '#eee', fontSize: '16px'}}><strong>Education:</strong> {directorData.phd}</p>
                <p style={{margin: '10px 0', color: '#eee', fontSize: '16px'}}><strong>Email:</strong> <a href={'mailto:'+directorData.email} style={{color: '#3498db'}}>{directorData.email}</a></p>
                <p style={{margin: '10px 0', color: '#eee', fontSize: '16px'}}><strong>YouTube Channel:</strong> <a href={directorData.youtube} target="_blank" rel="noreferrer" style={{color: '#e74c3c'}}>{directorData.name}'s Channel</a></p>
             </div>

             <div style={{ textAlign: 'left', background: '#111', padding: '25px', borderRadius: '8px', maxWidth: '800px', margin: '20px auto 0 auto', border: '1px solid #333' }}>
                <h3 style={{ color: '#3498db', marginTop: 0, marginBottom: '15px' }}>Director's Message & Bio</h3>
                {directorData.bio.map((paragraph, idx) => (
                  <p key={idx} style={{ color: '#ccc', lineHeight: '1.8', fontSize: '15px', marginBottom: '15px', textAlign: 'justify' }}>
                    {paragraph}
                  </p>
                ))}
             </div>
           </div>
        </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', background: '#1a1a1a', color: '#e0e0e0', height: '100%', overflowY: 'auto', borderRadius: '8px', boxSizing: 'border-box' },
  header: { color: '#fff', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 },
  popup: { background: '#222', borderRadius: '8px', border: '1px solid #444', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', overflow: 'hidden', marginTop: '20px' }
};
