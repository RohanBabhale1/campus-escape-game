import React, { useState } from 'react';

const rawFacultyMembers = [
  {
    "name": "Dr. Abdul Wahid",
    "image": "https://iiitdwd.ac.in/images/Dr.AbdulWahid.jpeg",
    "desc": "Assistant Professor",
    "email": "abdul.wahid@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (IIT Dhanbad)",
    "areas": [
      "Artificial Intelligence",
      "Evolutionary Computing",
      "Reinforcement Learning"
    ]
  },
  {
    "name": "Dr. Anand J Bariya",
    "image": "https://iiitdwd.ac.in/images/AnandJBariya.png",
    "desc": "Professor of Practice",
    "email": "abariya@alumni.stanford.edu",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (Stanford)"
  },
  {
    "name": "Dr. Anand P. Barangi",
    "image": "https://iiitdwd.ac.in/images/Dr.AnandP.Barangi.jpg",
    "desc": "Assistant Professor",
    "email": "anandbarangi@iiitdwd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "Ph.D. (Karnatak University, Dharwad)"
  },
  {
    "name": "Dr. Animesh Chaturvedi",
    "image": "https://iiitdwd.ac.in/images/Dr.AnimeshChaturvedi.jpg",
    "desc": "Assistant Professor",
    "email": "animesh@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (IIT Indore)",
    "areas": [
      "Data Science and AI",
      "Systems Engineering",
      "SOA and Cloud Computing"
    ]
  },
  {
    "name": "Dr. Animesh Roy",
    "image": "https://iiitdwd.ac.in/images/Dr.AnimeshRoy.jpg",
    "desc": "Assistant Professor",
    "email": "animeshroy@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (IIEST)",
    "areas": [
      "Delay tolerant networks",
      "Network optimization"
    ]
  },
  {
    "name": "Dr. Anushree kini",
    "image": "https://iiitdwd.ac.in/images/Dr.Anushreekini.jpg",
    "desc": "Assistant Professor",
    "email": "anushree@iiitdwd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "Ph.D. (KLE Technological University)"
  },
  {
    "name": "Dr. Aswath Babu H",
    "image": "https://iiitdwd.ac.in/images/Dr.AswathBabuH.jpeg",
    "desc": "Assistant Professor",
    "email": "aswath@iiitdwd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "Ph.D. (IIT Kanpur)",
    "areas": [
      "Quantum Optics",
      "Quantum Information Theory"
    ]
  },
  {
    "name": "Dr. Chandrika Kamath",
    "image": "https://iiitdwd.ac.in/images/Dr.ChandrikaKamath.png",
    "desc": "Visiting Faculty",
    "email": null,
    "dept": "Department of Arts, Science, and Design",
    "phd": "Ph.D. (KUD)"
  },
  {
    "name": "Dr. Chinmayananda A",
    "image": "https://iiitdwd.ac.in/images/Dr.ChinmayanandaA.jpg",
    "desc": "Assistant Professor",
    "email": "chinmay@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (IISc Bengaluru)",
    "areas": [
      "Wireless Communications",
      "Coding Theory",
      "Machine Learning"
    ]
  },
  {
    "name": "Dr. Deepak K T",
    "image": "https://iiitdwd.ac.in/images/Dr.DeepakKT.jpeg",
    "desc": "Assistant Professor",
    "email": "deepak@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (IIT Guwahati)",
    "areas": [
      "Speech/Audio Processing"
    ]
  },
  {
    "name": "Dr. Dibyajyoti Guha",
    "image": "https://iiitdwd.ac.in/images/Dr.DibyajyotiGuha.jpg",
    "desc": "Assistant Professor",
    "email": "dguha@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (IIT Bhubaneswar)",
    "areas": [
      "Machine Learning",
      "Computer Vision",
      "Hyperspectral Imaging"
    ]
  },
  {
    "name": "DR. G SRIKANTHA SHARMA",
    "image": "https://iiitdwd.ac.in/images/Dr. G Srikantha Sharma.jpg",
    "desc": "Professor-of-Practice",
    "email": "halseaking@gmail.com",
    "dept": null,
    "phd": null
  },
  {
    "name": "Dr. Girish G N",
    "image": "https://iiitdwd.ac.in/images/Dr.GirishGN.jpeg",
    "desc": "Assistant Professor",
    "email": "girish@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NITK)",
    "areas": [
      "Medical Image Analysis",
      "Image Processing"
    ]
  },
  {
    "name": "Dr. Girish Revadigar",
    "image": "https://iiitdwd.ac.in/images/Girish_Revadigar_Photo_-_Dr._Girish_Revadigar__1_.jpg",
    "desc": "Assistant Professor",
    "email": "girishrevadigar@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "PhD (The University of New South Wales (UNSW) Sydney, Australia)",
    "areas": [
      "AI/ML",
      "Blockchain for Cybersecurity",
      "Cybersecurity and Resilience for - IoT",
      "Cyber Physical Systems",
      "Autonomous Systems",
      "Wireless Networks",
      "Physical Layer Security"
    ]
  },
  {
    "name": "Dr. Jagadeesha R B",
    "image": "https://iiitdwd.ac.in/images/Dr.JagadeeshaRB.jpg",
    "desc": "Assistant Professor",
    "email": "Jagadeesha@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (NTHU, Taiwan)",
    "areas": [
      "Next Generation Wireless Networks",
      "D2D Communication",
      "IoT",
      "5G"
    ]
  },
  {
    "name": "Dr. Jagadish D N",
    "image": "https://iiitdwd.ac.in/images/Dr.JagadishDN.jpeg",
    "desc": "Assistant Professor",
    "email": "jagadishdn@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (NITK Surathkal)",
    "areas": [
      "Analog VLSI",
      "Mixed Signal VLSI Design"
    ]
  },
  {
    "name": "Dr. Krishnendu Ghosh",
    "image": "https://iiitdwd.ac.in/images/Dr.KrishnenduGhosh.png",
    "desc": "Assistant Professor",
    "email": "krishnendu@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (IIT Kharagpur)",
    "areas": [
      "Natural Language Processing"
    ]
  },
  {
    "name": "Dr. Malay Kumar",
    "image": "https://iiitdwd.ac.in/images/Dr.MalayKumar.jpg",
    "desc": "Assistant Professor",
    "email": "malay.kumar@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NIT Raipur)",
    "areas": [
      "Light Weight Cryptography",
      "Fully Homomorphic Encryption"
    ]
  },
  {
    "name": "Dr. Manjunath K V",
    "image": "https://iiitdwd.ac.in/images/Dr.ManjunathKV.jpg",
    "desc": "Assistant Professor",
    "email": "manjunathkv@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (NITK Surathkal)"
  },
  {
    "name": "Dr. Manjusha C B",
    "image": "https://iiitdwd.ac.in/images/ManjushaCB.jpeg",
    "desc": "Assistant Professor",
    "email": "manjusha@iiitdwd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "PhD (VIT Chennai)",
    "areas": [
      "English Language and Literature",
      "Blue Humanities",
      "Gastronomic Studies",
      "Narrative Gerontology",
      "Health Communication"
    ]
  },
  {
    "name": "Dr. Milind Chabbi",
    "image": "https://iiitdwd.ac.in/images/Milind-Chabbi.png",
    "desc": "Professor of Practice",
    "email": "Chabbi.Milind@Gmail.com",
    "dept": "Computer Science & Engineering",
    "phd": "Rice Univeristy"
  },
  {
    "name": "Dr. Muthusankar Eswaran",
    "image": "https://iiitdwd.ac.in/images/Muthusankar_Eswaran_Profile_photo.png",
    "desc": "Assistant Professor",
    "email": "shankarphd26@gmail.com",
    "dept": "Electronics and Communication Engineering",
    "phd": "PhD : NIT Puducherry",
    "areas": [
      "Flexible/Wearable Sensors/Biosensors (Healthcare diagnostics and environmental monitoring)",
      "Self-powered wearable systems",
      "Analog Interface Circuits",
      "Flexible nanoelectronics, MEMS/NEMS, and microfabrication",
      "Semiconductors Devices & Advanced 2D materials"
    ]
  },
  {
    "name": "Dr. Nataraj K S",
    "image": "https://iiitdwd.ac.in/images/Dr.NatarajKS.jpg",
    "desc": "Assistant Professor",
    "email": "nataraj@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (IIT Bombay)",
    "areas": [
      "Speech/Audio Processing",
      "Machine Learning"
    ]
  },
  {
    "name": "Dr. Pankaj Kumar",
    "image": "https://iiitdwd.ac.in/images/Pankaj_Kumar.jpg",
    "desc": "Assistant Professor",
    "email": "iitdhn.pankaj@gmail.com",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (Indian Institute of Technology (ISM) Dhanbad, India)",
    "areas": [
      "Semiconductor Device Physics",
      "Emerging FET Devices",
      "Analog VLSI Circuits",
      "CMOS for low-power applications",
      "Biosensors"
    ]
  },
  {
    "name": "Dr. Pavan Kumar C",
    "image": "https://iiitdwd.ac.in/images/Dr.PavanKumarC.jpg",
    "desc": "Assistant Professor",
    "email": "pavan@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (VIT Vellore)",
    "areas": [
      "Coding Theory",
      "Data Communication",
      "Formal Languages and Automata Theory"
    ]
  },
  {
    "name": "Dr. Prabhu Prasad B M",
    "image": "https://iiitdwd.ac.in/images/Dr.PrabhuPrasadBM.png",
    "desc": "Assistant Professor",
    "email": "prabhuprasad@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NITK Surathkal)",
    "areas": [
      "Computer architecture",
      "Network-on-Chips"
    ]
  },
  {
    "name": "Dr. Prakash Pawar",
    "image": "https://iiitdwd.ac.in/images/Dr.PrakashPawar.jpg",
    "desc": "Assistant Professor",
    "email": "Prakashpawar@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (NITK Surathkal)",
    "areas": [
      "Demand Side Energy Management",
      "Embedded System & IoT",
      "Machine Learning"
    ]
  },
  {
    "name": "Dr. Pramod Yelmewad",
    "image": "https://iiitdwd.ac.in/images/Dr.PramodYelmewad.jpg",
    "desc": "Assistant Professor",
    "email": "pramodyelmewad@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NITK Surathkal)",
    "areas": [
      "Parallel Computing"
    ]
  },
  {
    "name": "Dr. Pratibha Moogi",
    "image": "https://iiitdwd.ac.in/images/Personal.jpg",
    "desc": "Professor-of-Practice",
    "email": "pratibhamoogi@yahoo.co.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "PhD (Oregon Graduate Institute, OHSU, Portland)",
    "areas": [
      "AI Algorithms & Systems",
      "Cloud  IT  Automation Technologies"
    ]
  },
  {
    "name": "Dr. Rajendra Hegadi",
    "image": "https://iiitdwd.ac.in/images/Dr.RajendraHegadi.jpeg",
    "desc": "Associate Professor",
    "email": "rajendrahegadi@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (MGRRI, Chennai)",
    "areas": [
      "Cryptography & Network Security",
      "Blockchain and AI/ML"
    ]
  },
  {
    "name": "Dr. Rajesh Kumar",
    "image": "https://iiitdwd.ac.in/images/Dr.RajeshKumar.jpg",
    "desc": "Assistant Professor",
    "email": "rajeshk@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. IIT (ISM) Dhanbad",
    "areas": [
      "RF VLSI Design",
      "RFIC",
      "MMIC Design",
      "RF Power Amplifier"
    ]
  },
  {
    "name": "Dr. Ramesh Athe",
    "image": "https://iiitdwd.ac.in/images/Dr.RameshAthe.jpg",
    "desc": "Assistant Professor",
    "email": "ramesh@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (Osmania University, Hyderabad)",
    "areas": [
      "Data Science, Machine learning",
      "Meta-Analysis"
    ]
  },
  {
    "name": "Dr. Ravikumar C.P",
    "image": "https://iiitdwd.ac.in/images/RavikumarCP.jpg",
    "desc": "Adjunct Professor",
    "email": null,
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D - University of Southern California Los Angeles, CA",
    "areas": [
      "VLSI physical design",
      "VLSI test",
      "parallel processing",
      "electronic design automation"
    ]
  },
  {
    "name": "Dr. Sandesh Sanjeev Phalke",
    "image": "https://iiitdwd.ac.in/images/Sandesh_Sanjeev_Phalke.jpg",
    "desc": "Assistant Professor",
    "email": "s.phalke@iiitdwd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "Ph.D. (Indian Institute of Technology Guwahati,Guwahati, India.)",
    "areas": [
      "Co-Design",
      "Early childhood education and care"
    ]
  },
  {
    "name": "Dr. Shirshendu Layek",
    "image": "https://iiitdwd.ac.in/images/Dr.ShirshenduLayek.jpg",
    "desc": "Assistant  Professor",
    "email": "shirshendu@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (IIT Dhanbad)",
    "areas": [
      "Computer Vision"
    ]
  },
  {
    "name": "Dr. Shrinivas Kulkarni",
    "image": "https://iiitdwd.ac.in/images/ShrinivasKulkarni.jpeg",
    "desc": "Professor of Practice",
    "email": "shrinivaskk@gmail.com",
    "dept": "Computer Science & Engineering",
    "phd": "PhD - University of Edinburgh"
  },
  {
    "name": "Dr. Shruti Maralappanavar",
    "image": "https://iiitdwd.ac.in/images/Shruti.jpg",
    "desc": "Assistant Professor",
    "email": "mshruti32@gmail.com",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "PhD: IIT Dharwad",
    "areas": [
      "Federated Learning",
      "Bilevel Optimization",
      "Online Learning"
    ]
  },
  {
    "name": "Dr. Sibasankar Padhy",
    "image": "https://iiitdwd.ac.in/images/Dr.SibasankarPadhy.jpg",
    "desc": "Assistant Professor",
    "email": "sibasankar@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (IIT Guwahati)"
  },
  {
    "name": "Dr. Somen Bhattacharjee",
    "image": "https://iiitdwd.ac.in/images/Dr.SomenBhattacharjee.jpeg",
    "desc": "Assistant  Professor",
    "email": "somen@iiitdwd.ac.in",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D. (IIT Guwahati)",
    "areas": [
      "Analytical & Numerical Electromagnetics",
      "Microwave Engg"
    ]
  },
  {
    "name": "Dr. Sunil C K",
    "image": "https://iiitdwd.ac.in/images/Dr.SunilCK.jpg",
    "desc": "Assistant  Professor",
    "email": "sunilck@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NITK Surathkal)",
    "areas": [
      "Artificial intelligence [ML and DL]",
      "IoT"
    ]
  },
  {
    "name": "Dr. Sunil Kumar P V",
    "image": "https://iiitdwd.ac.in/images/Dr.SunilKumarPV.jpg",
    "desc": "Assistant  Professor",
    "email": "sunilkumar.pv@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NIT, Calicut)",
    "areas": [
      "Computational Biology",
      "Bioinformatics"
    ]
  },
  {
    "name": "Dr. Sunil Saumya",
    "image": "https://iiitdwd.ac.in/images/Dr.SunilSaumya.jpeg",
    "desc": "Assistant Professor",
    "email": "sunil.saumya@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (NIT Patna)"
  },
  {
    "name": "Dr. Suvadip Hazra",
    "image": "https://iiitdwd.ac.in/images/Dr-Suvadip-Hazra.png",
    "desc": "Assistant Professor",
    "email": "suvadip@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (NIT Durgapur)",
    "areas": [
      "Hardware Security",
      "Cellular Automata"
    ]
  },
  {
    "name": "Dr. Swagatika Sahoo",
    "image": "https://iiitdwd.ac.in/images/Swagatika_Sahoo.jpeg",
    "desc": "Assistant Professor",
    "email": "swagatika@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "PhD: IIT Patna",
    "areas": [
      "Blockchain",
      "Federated Learning",
      "Cybersecurity"
    ]
  },
  {
    "name": "Dr. Vivekraj V K",
    "image": "https://iiitdwd.ac.in/images/Dr.VivekrajVK.jpg",
    "desc": "Assistant  Professor",
    "email": "vivekraj@iiitdwd.ac.in",
    "dept": "Computer Science & Engineering",
    "phd": "Ph.D. (IIT Roorkee)",
    "areas": [
      "Computer Vision"
    ]
  },
  {
    "name": "Dr.Siddharth R",
    "image": "https://iiitdwd.ac.in/images/Dr.SiddharthR.jpg",
    "desc": "Assistant  Professor",
    "email": "siddharth_r@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (NIT Puducherry)",
    "areas": [
      "Data Preprocessing"
    ]
  },
  {
    "name": "Dr.Utkarsh Khaire",
    "image": "https://iiitdwd.ac.in/images/Dr.UtkarshKhaire.jpg",
    "desc": "Assistant  Professor",
    "email": "utkarshkhaire@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (NIT Nagaland)",
    "areas": [
      "Data Analytics"
    ]
  },
  {
    "name": "Karthik Sankaran",
    "image": "https://iiitdwd.ac.in/images/KarthikSankaran.jpeg",
    "desc": "Professor of Practice",
    "email": "sankaran.karthik@gmail.com",
    "dept": "Electronics and Communication Engineering",
    "phd": "PhD - University of Texas at Austin"
  },
  {
    "name": "Mr. Chetan Khosla",
    "image": "https://iiitdwd.ac.in/images/Mr.Chetan_Khosla.jpg",
    "desc": "Professor of Practice",
    "email": "Chetan.khosla@wyzmindz.com",
    "dept": "Department of Arts, Science, and Design",
    "phd": "BE ( Mechanical) at Delhi College Of Engineering, Delhi, India"
  },
  {
    "name": "Mr. Mallikarjun Kande",
    "image": "https://iiitdwd.ac.in/images/MrMallikarjunKande.jfif",
    "desc": "Professor of Practice",
    "email": "Mallikarjun.kande@us.abb.com",
    "dept": "Electronics and Communication Engineering",
    "phd": "Masters in Engineering (Power Electronics)",
    "areas": [
      "IoT & Cloud Technologies",
      "Cyber Security Solutions and Deployment"
    ]
  },
  {
    "name": "Mr. Ram Subramanian",
    "image": "https://iiitdwd.ac.in/images/MrRamSubramanian.jpg",
    "desc": "Professor of Practice",
    "email": "ramsubramanian@iiitdwd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "Master Degree (Quantitative Business Economics, Purdue University)",
    "areas": [
      "Entrepreneurship",
      "Product Management"
    ]
  },
  {
    "name": "Mr. Santosh Devanallikar",
    "image": "https://iiitdwd.ac.in/images/SantoshDevanallikar.jpeg",
    "desc": "Professor of Practice",
    "email": null,
    "dept": "Electronics and Communication Engineering",
    "phd": "M.Sc - University of Southampton, Southampton, UK",
    "areas": [
      "ASIC/Chip-Design",
      "VLSI",
      "VCS, NC-Verilog",
      "Design-Compiler",
      "RTL compiler"
    ]
  },
  {
    "name": "Prof. Ambarish Kulkarni",
    "image": "https://iiitdwd.ac.in/images/AmbarishKulkarni.jpg",
    "desc": "Adjunct Professor",
    "email": "ambarishkulkarni@swin.edu.au",
    "dept": "Electronics and Communication Engineering",
    "phd": "Ph.D - Swinburne University of Technology, Australia",
    "areas": [
      "Biotechnology",
      "Transportation Systems Engineering",
      "Electric Vehicle Research",
      "Virtual Design and Prototyping",
      "Design and development"
    ]
  },
  {
    "name": "Prof. Girish Dhanakshirur",
    "image": "https://iiitdwd.ac.in/images/GirishDhanakshirur.jpg",
    "desc": "Professor of Practice",
    "email": "girishdhanak@in.ibm.com",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "M.S (Computer Science & Engineering) from Florida Atlantic University, USA "
  },
  {
    "name": "Prof. Israel Cohen",
    "image": "https://iiitdwd.ac.in/images/IsraelCohen.jpg",
    "desc": "Adjunct Professor",
    "email": "icohen@ee.technion.ac.il",
    "dept": "Electronics and Communication Engineering",
    "phd": "Technion- Israel Institute of Technology, Haifa, Israel",
    "areas": [
      "Array Signal Processing",
      "Speech and image processing",
      "Electric Vehicle Research",
      "Immersive voice communication",
      "Design and development"
    ]
  },
  {
    "name": "Prof. Rajesh Vasa",
    "image": "https://iiitdwd.ac.in/images/RajeshVasa.jpg",
    "desc": "Adjunct Professor",
    "email": null,
    "dept": "Computer Science & Engineering",
    "phd": "PhD - Swinburne Univ. of Technology"
  },
  {
    "name": "Prof. S R Mahadeva Prasanna",
    "image": "https://iiitdwd.ac.in/images/SRMahadevaPrasanna.jpg",
    "desc": "Professor and Director",
    "email": "prasanna@iiitdwd.ac.in",
    "dept": "Data Science and Artificial Intelligence",
    "phd": "Ph.D. (IIT Madras)",
    "areas": [
      "Speech and Handwriting Processing",
      "Applications of Signal Processing and Pattern Recognition",
      "Applications of Artificial Intelligence",
      "Machine Learning"
    ]
  },
  {
    "name": "Prof. V. Ravishankar",
    "image": "https://iiitdwd.ac.in/images/Prof.V.Ravishankar.jpg",
    "desc": "Adjunct Professor",
    "email": "vravi@physics.iitd.ac.in",
    "dept": "Department of Arts, Science, and Design",
    "phd": "Ph.D",
    "areas": [
      "High Energy Physics"
    ]
  }
];

export default function FacultyDetails() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  return (
    <div style={styles.container}>
      {!selectedFaculty && (
        <>
          <h1 style={styles.header}>Institute Faculty</h1>
          <p style={styles.intro}>Meet the esteemed faculty members of IIIT Dharwad, guiding our students to excellence.</p>
          
          <div style={styles.grid}>
            {rawFacultyMembers.map((fac, i) => {
              const bgImage = 'url(' + fac.image + ')';
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
                onClick={() => setSelectedFaculty(fac)}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(10,10,10,0.5)',
                    zIndex: 0,
                    transition: 'background-color 0.3s'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <h3 style={{...styles.cardTitle, margin: 0, textDecoration: 'underline', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,1)'}}>
                      {fac.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedFaculty && (
        <div style={styles.popup}>
           <div style={{
             backgroundImage: 'url(' + selectedFaculty.image + ')',
             backgroundSize: 'contain',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
             backgroundColor: '#111',
             height: '300px',
             borderRadius: '8px 8px 0 0',
             borderBottom: '2px solid #333'
           }}></div>
           <div style={{ padding: '20px', textAlign: 'center' }}>
             <h2 style={{ color: '#3498db', marginTop: 0, marginBottom: '5px' }}>{selectedFaculty.name}</h2>
             <h3 style={{ color: '#aaa', marginTop: 0, marginBottom: '20px', fontWeight: 'normal' }}>{selectedFaculty.desc}</h3>
             
             <div style={{ textAlign: 'left', background: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                {selectedFaculty.dept && <p style={{margin: '5px 0', color: '#eee'}}><strong>Department:</strong> {selectedFaculty.dept}</p>}
                {selectedFaculty.phd && <p style={{margin: '5px 0', color: '#eee'}}><strong>Education:</strong> {selectedFaculty.phd}</p>}
                {selectedFaculty.email && <p style={{margin: '5px 0', color: '#eee'}}><strong>Email:</strong> <a href={'mailto:'+selectedFaculty.email} style={{color: '#3498db'}}>{selectedFaculty.email}</a></p>}
                
                {selectedFaculty.areas && selectedFaculty.areas.length > 0 && (
                  <div style={{marginTop: '15px'}}>
                    <strong style={{color: '#eee'}}>Areas of Interest:</strong>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
                      {selectedFaculty.areas.map((a, i) => (
                        <span key={i} style={{background: '#333', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', color: '#85c1e9', border: '1px solid #444'}}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
             </div>

             <button onClick={() => setSelectedFaculty(null)} style={styles.backBtn}>Back to List</button>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    paddingBottom: '20px'
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
    transition: 'transform 0.2s, border 0.3s',
    minHeight: '200px'
  },
  cardTitle: {
    fontSize: '18px',
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
    width: '100%'
  }
};
