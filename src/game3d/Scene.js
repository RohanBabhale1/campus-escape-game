import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function init3DScene(container, user, callbacks) {
  // --- STATE ---
  let isDestroyed = false;

  // --- SCENE SETUP ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 40, 150);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 20);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground
  controls.minDistance = 5;
  controls.maxDistance = 250;
  controls.enablePan = true;

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
  sunLight.position.set(30, 60, 30);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.left = -60;
  sunLight.shadow.camera.right = 60;
  sunLight.shadow.camera.top = 60;
  sunLight.shadow.camera.bottom = -60;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // --- CLOUDS ---
  const cloudGeo = new THREE.SphereGeometry(4, 7, 7);
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
  for(let i=0; i<25; i++) {
    const cloud = new THREE.Group();
    const numPuffs = 3 + Math.floor(Math.random() * 4);
    for(let p=0; p<numPuffs; p++) {
      const puff = new THREE.Mesh(cloudGeo, cloudMat);
      puff.position.set(Math.random()*6 - 3, Math.random()*2, Math.random()*6 - 3);
      const scale = 0.5 + Math.random()*0.8;
      puff.scale.set(scale, scale, scale);
      cloud.add(puff);
    }
    cloud.position.set( (Math.random() - 0.5) * 200, 40 + Math.random() * 20, (Math.random() - 0.5) * 200 );
    scene.add(cloud);
  }

  // --- ENVIRONMENT ---
  // Muddy green environment (Outside)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({ color: 0x4a5d23, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Grass/Muddy green (Inside campus)
  const campusGround = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 150),
    new THREE.MeshStandardMaterial({ color: 0x4a5d23, roughness: 1 })
  );
  campusGround.rotation.x = -Math.PI / 2;
  campusGround.position.set(0, 0.01, -80); // slightly elevated to avoid z-fighting
  campusGround.receiveShadow = true;
  scene.add(campusGround);

  // --- BOUNDARY WALL ---
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.9 });
  const wallH = 6;
  const wallT = 2;

  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, 150), wallMat);
  leftWall.position.set(-110, wallH/2, -80); leftWall.castShadow = true; leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, 150), wallMat);
  rightWall.position.set(110, wallH/2, -80); rightWall.castShadow = true; rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Back Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(220, wallH, wallT), wallMat);
  backWall.position.set(0, wallH/2, -155); backWall.castShadow = true; backWall.receiveShadow = true;
  scene.add(backWall);

  // Front Wall (aligned for road gap at x=65)
  // Left side spans from X=-110 to X=57.5 (width 167.5, center -26.25)
  const fwLeft = new THREE.Mesh(new THREE.BoxGeometry(167.5, wallH, wallT), wallMat);
  fwLeft.position.set(-26.25, wallH/2, -5); fwLeft.castShadow = true; fwLeft.receiveShadow = true;
  scene.add(fwLeft);

  // Right side spans from X=72.5 to X=110 (width 37.5, center 91.25)
  const fwRight = new THREE.Mesh(new THREE.BoxGeometry(37.5, wallH, wallT), wallMat);
  fwRight.position.set(91.25, wallH/2, -5); fwRight.castShadow = true; fwRight.receiveShadow = true;
  scene.add(fwRight);

  // --- ROADS ---
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 1 });
  
  // Main vertical road tracking the Central-Right Spine (x=65)
  const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(7, 180), roadMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.set(65, 0.05, -50);
  mainRoad.receiveShadow = true;
  scene.add(mainRoad);

  for(let i=0; i<18; i++) {
     const line = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 3), lineMat);
     line.rotation.x = -Math.PI / 2;
     line.position.set(65, 0.06, 35 - i*10);
     scene.add(line);
  }

  // Branch 1: Pi Block Plaza link (Z = -45) spans from X=65 to -45 (width 110)
  const crossRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(110, 7), roadMat);
  crossRoad1.rotation.x = -Math.PI / 2;
  crossRoad1.position.set(10, 0.05, -45);
  scene.add(crossRoad1);

  // Branch 2: E Block Link (Z = -100) spans from 65 to 0 (width 65)
  const crossRoad2 = new THREE.Mesh(new THREE.PlaneGeometry(65, 7), roadMat);
  crossRoad2.rotation.x = -Math.PI / 2;
  crossRoad2.position.set(32.5, 0.05, -100);
  scene.add(crossRoad2);

  // Branch 3: Deep Campus Link (Z = -135) spans from 65 to -90 (width 155)
  const crossRoad3 = new THREE.Mesh(new THREE.PlaneGeometry(155, 7), roadMat);
  crossRoad3.rotation.x = -Math.PI / 2;
  crossRoad3.position.set(-12.5, 0.05, -135);
  scene.add(crossRoad3);

  // --- TREES ---
  const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
  const treeLeavesGeo = new THREE.ConeGeometry(1.5, 4, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });

  const addTree = (x, z) => {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    
    const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
    trunk.position.y = 1; trunk.castShadow = true; trunk.receiveShadow = true;
    tree.add(trunk);

    const leaves = new THREE.Mesh(treeLeavesGeo, leavesMat);
    leaves.position.y = 3; leaves.castShadow = true; leaves.receiveShadow = true;
    tree.add(leaves);

    scene.add(tree);
  };

  // Line trees cleanly alongside the main road (X=65)
  for(let z = -15; z >= -145; z -= 12) {
      addTree(65 - 7, z); // Left side
      addTree(65 + 7, z); // Right side
  }
  
  // Line trees elegantly along the Deep Campus Route (Z=-135)
  for(let x = 50; x >= -80; x -= 13) {
      addTree(x, -135 + 6); // Bottom ledge
  }

  const gateGroup = new THREE.Group();
  gateGroup.position.set(65, 0, -10);
  scene.add(gateGroup);
  
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.4 });
  const blockMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  
  // Left Side (Asymmetric Complex Pillars)
  const leftInner = new THREE.Mesh(new THREE.BoxGeometry(3, 12, 4), silverMat);
  leftInner.position.set(-5.5, 6, 0); leftInner.castShadow = true; leftInner.receiveShadow = true;
  gateGroup.add(leftInner);
  const cabinWin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 4.1), blockMat);
  cabinWin.position.set(-5.5, 2.5, 0); gateGroup.add(cabinWin);

  const leftMid = new THREE.Mesh(new THREE.BoxGeometry(3, 16, 4), silverMat);
  leftMid.position.set(-8.5, 8, 0); leftMid.castShadow = true; leftMid.receiveShadow = true;
  gateGroup.add(leftMid);

  const leftOuter = new THREE.Mesh(new THREE.BoxGeometry(3, 14, 4), silverMat);
  leftOuter.position.set(-11.5, 7, 0); leftOuter.castShadow = true; leftOuter.receiveShadow = true;
  gateGroup.add(leftOuter);

  // Right Side (Simpler Pillars)
  const rightInner = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4), silverMat);
  rightInner.position.set(6, 6, 0); rightInner.castShadow = true; rightInner.receiveShadow = true;
  gateGroup.add(rightInner);
  
  const rightStone = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 2), blockMat);
  rightStone.position.set(10.5, 2.5, 0); rightStone.castShadow = true; rightStone.receiveShadow = true;
  gateGroup.add(rightStone);

  // Top Fascia Beam
  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(30, 3.5, 4.2), beamMat);
  topBeam.position.set(0, 13.75, 0); topBeam.castShadow = true; topBeam.receiveShadow = true;
  gateGroup.add(topBeam);

  // Helper Functions
  const createRoom = (name, color, x, z) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const body = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({ color }));
    body.position.y = 2;
    body.castShadow = true;
    group.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 4.2), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    roof.position.y = 4.25;
    group.add(roof);
    scene.add(group);
  };

  const createHostel = (name, color, x, z) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const body = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 6), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    body.position.y = 6;
    body.castShadow = true;
    group.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1, 6.5), new THREE.MeshStandardMaterial({ color }));
    roof.position.y = 12.5;
    group.add(roof);
    scene.add(group);
  };

  // createRoom("Code", 0x2196f3, -15, -20);
  // createRoom("Design", 0xffeb3b, 15, -20);
  // createHostel("Boys", 0x2196f3, -30, -25);
  // createHostel("Girls", 0xe91e63, 30, -25);

  const buildingsList = [];

  const addWindows = (parentGroup, xCenter, yBase, zCenter, bWidth, bHeight, bDepth, rows, cols, wWidth, wHeight, winColor) => {
    const winGeo = new THREE.PlaneGeometry(wWidth, wHeight);
    const winMat = new THREE.MeshStandardMaterial({ color: winColor, metalness: 0.9, roughness: 0.1 });
    const zF = zCenter + bDepth / 2 + 0.01;
    const zB = zCenter - bDepth / 2 - 0.01;
    const xR = xCenter + bWidth / 2 + 0.01;
    const xL = xCenter - bWidth / 2 - 0.01;

    for(let i=0; i<rows; i++) {
        const y = yBase + bHeight * 0.15 + (rows > 1 ? i * (bHeight * 0.7 / (rows - 1)) : 0);
        for(let j=0; j<cols; j++) {
            const xDist = cols > 1 ? (bWidth * 0.8) / (cols - 1) : 0;
            const windowX = cols > 1 ? xCenter - (bWidth * 0.4) + (j * xDist) : xCenter;
            const zDist = cols > 1 ? (bDepth * 0.8) / (cols - 1) : 0;
            const windowZ = cols > 1 ? zCenter - (bDepth * 0.4) + (j * zDist) : zCenter;

            const wf = new THREE.Mesh(winGeo, winMat); wf.position.set(windowX, y, zF); parentGroup.add(wf);
            const wb = new THREE.Mesh(winGeo, winMat); wb.position.set(windowX, y, zB); wb.rotation.y = Math.PI; parentGroup.add(wb);
            const wr = new THREE.Mesh(winGeo, winMat); wr.position.set(xR, y, windowZ); wr.rotation.y = Math.PI/2; parentGroup.add(wr);
            const wl = new THREE.Mesh(winGeo, winMat); wl.position.set(xL, y, windowZ); wl.rotation.y = -Math.PI/2; parentGroup.add(wl);
        }
    }
  };

  const createEBlock = (x, z) => {
    const group = new THREE.Group(); group.position.set(x, 0, z);
    
    const bWidth = 56; const bHeight = 30; const bDepth = 20;

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.9 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.8 });
    
    const baseHeight = 6;
    const baseBox = new THREE.Mesh(new THREE.BoxGeometry(bWidth, baseHeight, bDepth), baseMat);
    baseBox.position.y = baseHeight / 2;
    baseBox.castShadow = true; group.add(baseBox);

    const leftWingH = bHeight - baseHeight;
    const leftWingW = 26;
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(leftWingW, leftWingH, bDepth), whiteMat);
    leftWing.position.set(-15, baseHeight + leftWingH/2, 0); 
    leftWing.castShadow = true; group.add(leftWing);

    const rightWingW = 18;
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(rightWingW, leftWingH, bDepth), whiteMat);
    rightWing.position.set(19, baseHeight + leftWingH/2, 0); 
    rightWing.castShadow = true; group.add(rightWing);

    const midWingW = 12;
    const midWing = new THREE.Mesh(new THREE.BoxGeometry(midWingW, leftWingH, bDepth - 4), baseMat); 
    midWing.position.set(4, baseHeight + leftWingH/2, -2);
    midWing.castShadow = true; group.add(midWing);

    const porticoW = 18;
    const porticoThickness = 1.5;
    const porticoForward = 12; 
    
    const porticoRoof = new THREE.Mesh(new THREE.BoxGeometry(porticoW, porticoThickness, porticoForward), whiteMat);
    porticoRoof.position.set(10, baseHeight + 8, porticoForward / 2 + bDepth/2);
    porticoRoof.castShadow = true; group.add(porticoRoof);

    const radius = 0.6;
    const colH = baseHeight + 8; 
    const colGeo = new THREE.CylinderGeometry(radius, radius, colH, 16);
    
    const colPositions = [
        { cx: 3, cz: bDepth/2 + porticoForward - 1 },
        { cx: 17, cz: bDepth/2 + porticoForward - 1 },
        { cx: 3, cz: bDepth/2 + porticoForward/2 },
        { cx: 17, cz: bDepth/2 + porticoForward/2 }
    ];
    colPositions.forEach(p => {
        const pillar = new THREE.Mesh(colGeo, whiteMat);
        pillar.position.set(p.cx, colH/2, p.cz);
        pillar.castShadow = true; group.add(pillar);
    });

    addWindows(group, -15, baseHeight, 0, leftWingW, leftWingH, bDepth, 5, 5, 2.5, 1.2, 0x111111);
    addWindows(group, 4, baseHeight, -2, midWingW, leftWingH, bDepth - 4, 4, 3, 2, 3, 0x87ceeb);
    addWindows(group, 19, baseHeight, 0, rightWingW, leftWingH, bDepth, 3, 2, 3, 2, 0x111111);

    scene.add(group); 
    buildingsList.push({ group, name: "e-block", bHeight: bHeight, bDepth: bDepth + porticoForward + 2 });
  };

  const createBBlock = (x, z) => {
    const group = new THREE.Group(); group.position.set(x, 0, z);
    const bHeight = 20; const bWidth = 25; const bDepth = 15;
    
    // Grey building body
    const mat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.4 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bDepth), mat);
    body.position.y = bHeight / 2; body.castShadow = true; group.add(body);
    
    // Green surrounding floor covering a larger area around it
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.9 });
    const floorW = bWidth + 20; const floorD = bDepth + 20;
    const grassFloor = new THREE.Mesh(new THREE.PlaneGeometry(floorW, floorD), grassMat);
    grassFloor.rotation.x = -Math.PI / 2;
    grassFloor.position.set(x, 0.02, z); // securely sits off ground slightly ensuring no Z-fighting overlaying the dark floor
    grassFloor.receiveShadow = true;
    scene.add(grassFloor);

    addWindows(group, 0, 0, 0, bWidth, bHeight, bDepth, 4, 1, bWidth - 2, 1.5, 0xbdc3c7);
    scene.add(group); buildingsList.push({ group, name: "b-block", bHeight, bDepth });
  };

  const getPaverTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#c2b2a1"; // Base paver color
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#b5a392"; 
    
    // Draw cleaner brick layout
    ctx.fillRect(0, 0, 58, 28);
    ctx.fillRect(64, 0, 58, 28);
    ctx.fillRect(32, 32, 58, 28);
    ctx.fillRect(96, 32, 32, 28);
    ctx.fillRect(-32, 32, 32, 28);
    ctx.fillRect(0, 64, 58, 28);
    ctx.fillRect(64, 64, 58, 28);
    ctx.fillRect(32, 96, 58, 28);
    ctx.fillRect(96, 96, 32, 28);
    ctx.fillRect(-32, 96, 32, 28);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 10);
    return tex;
  };

  const createPiBlock = (x, z) => {
    const group = new THREE.Group(); group.position.set(x, 0, z);
    
    // Extrapolate -90 degree rotation facing inward toward central road
    group.rotation.y = Math.PI / 2;

    const bHeight = 28; const bDepth = 15; const bWidth = 60;
    
    const leftMonolith = new THREE.Mesh(
      new THREE.BoxGeometry(10, 35, 18),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 })
    );
    leftMonolith.position.set(-bWidth/2 - 5, 35/2, 2);
    leftMonolith.castShadow = true; group.add(leftMonolith);

    const glassBody = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, bHeight, bDepth),
      new THREE.MeshStandardMaterial({ color: 0x4a3c31, roughness: 0.1, metalness: 0.8 })
    );
    glassBody.position.set(0, bHeight/2, 0); group.add(glassBody);

    const colMat = new THREE.MeshStandardMaterial({ color: 0xcbd0d3, roughness: 0.7 });
    for(let i=0; i<8; i++) {
       const colX = -bWidth/2 + 5 + i * 7.1;
       const col = new THREE.Mesh(new THREE.BoxGeometry(2, bHeight+4, 17), colMat);
       col.position.set(colX, (bHeight+4)/2, 1);
       col.castShadow = true; group.add(col);
    }
    
    const rightBlock = new THREE.Mesh(
      new THREE.BoxGeometry(12, 25, 18),
      new THREE.MeshStandardMaterial({ color: 0xcbd0d3, roughness: 0.8 })
    );
    rightBlock.position.set(bWidth/2 + 6, 25/2, 2);
    rightBlock.castShadow = true; group.add(rightBlock);

    const roofCurve = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth+25, 1, 16),
      new THREE.MeshStandardMaterial({ color: 0xcbd0d3, wireframe: true }) 
    );
    roofCurve.position.set(0, bHeight+5, 4);
    roofCurve.rotation.z = -0.05; 
    group.add(roofCurve);

    const paveMat = new THREE.MeshStandardMaterial({ map: getPaverTexture(), roughness: 0.9 });
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(70, 36), paveMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.rotation.z = Math.PI / 2; // Match the PiBlock rotation
    plaza.position.set(x + 23, 0.03, z); // Map it purely to the global scene independently
    plaza.receiveShadow = true;
    scene.add(plaza);

    scene.add(group); 
    buildingsList.push({ group, name: "pi-block", bHeight: bHeight+10, bDepth: bDepth });
  };

  const createGBlock = (x, z) => {
    const group = new THREE.Group(); group.position.set(x, 0, z);
    const bHeight = 18; const bWidth = 18; const bDepth = 18;
    const mat = new THREE.MeshStandardMaterial({ color: 0x8e24aa, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bDepth), mat); body.position.y = bHeight / 2; body.castShadow = true; group.add(body);
    const block1 = new THREE.Mesh(new THREE.BoxGeometry(bWidth+4, 6, bDepth-4), mat); block1.position.y = bHeight/2 - 4; block1.castShadow = true; group.add(block1);
    const block2 = new THREE.Mesh(new THREE.BoxGeometry(bWidth-4, 6, bDepth+4), mat); block2.position.y = bHeight/2 + 4; block2.castShadow = true; group.add(block2);
    addWindows(group, 0, 0, 0, bWidth, bHeight, bDepth, 3, 3, 2, 2, 0xce93d8);
    // Add text slightly shifted forward because of staggered blocks
    scene.add(group); buildingsList.push({ group, name: "g-block", bHeight, bDepth: bDepth + 4 }); 
  };

  const createHBlock = (x, z) => {
    const group = new THREE.Group(); group.position.set(x, 0, z);
    const bHeight = 15; const bDepth = 20; const sideW = 5; const centerW = 10;
    const mat = new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.6 });
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(sideW, bHeight, bDepth), mat); leftWing.position.set(-centerW/2 - sideW/2, bHeight/2, 0); leftWing.castShadow = true; group.add(leftWing);
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(sideW, bHeight, bDepth), mat); rightWing.position.set(centerW/2 + sideW/2, bHeight/2, 0); rightWing.castShadow = true; group.add(rightWing);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(centerW, bHeight, 5), mat); bridge.position.set(0, bHeight/2, 0); bridge.castShadow = true; group.add(bridge);
    addWindows(group, -centerW/2 - sideW/2, 0, 0, sideW, bHeight, bDepth, 4, 1, 2, 1.5, 0xffcdd2);
    addWindows(group, centerW/2 + sideW/2, 0, 0, sideW, bHeight, bDepth, 4, 1, 2, 1.5, 0xffcdd2);
    addWindows(group, 0, 0, 0, centerW, bHeight, 5, 4, 3, 1.5, 1.5, 0xffcdd2);
    scene.add(group); buildingsList.push({ group, name: "h-block", bHeight, bDepth });
  };

  const createSmallBlock = (x, z, color, name) => {
    const group = new THREE.Group(); group.position.set(x, 0, z);
    const bHeight = 8; const bWidth = 8; const bDepth = 8;
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bDepth), mat);
    body.position.y = bHeight / 2; body.castShadow = true; group.add(body);
    scene.add(group); buildingsList.push({ group, name, bHeight, bDepth });
  };

  createEBlock(0, -100);
  createBBlock(85, -80);
  createSmallBlock(55, -70, 0xffd700, "Chai Tapri");
  createSmallBlock(55, -90, 0x95a5a6, "Juice Tapri");
  createPiBlock(-45, -45);
  createGBlock(-55, -135);
  createHBlock(-90, -135);

  // Load font & Labels
  const fontLoader = new FontLoader();
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    if (isDestroyed) return;

    // Gate Label
    const textGeo = new TextGeometry('INDIAN INSTITUTE OF INFORMATION TECHNOLOGY DHARWAD', {
        font: font,
        size: 0.65,
        height: 0.05,
        depth: 0.05,
        curveSegments: 12,
        bevelEnabled: false
    });
    const textMat = new THREE.MeshStandardMaterial({ color: 0x003399, metalness: 0.1, roughness: 0.8 });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textGeo.computeBoundingBox();
    const xOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    textMesh.position.set(xOffset, 12.8, 2.15); // Align cleanly on the white beam facade
    textMesh.castShadow = true;
    gateGroup.add(textMesh);

    // Building Labels
    buildingsList.forEach(b => {
      const labelGeo = new TextGeometry(b.name, {
        font: font, size: 2.5, height: 0.05, depth: 0.05
      });
      const labelMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelGeo.computeBoundingBox();
      const lxOffset = -0.5 * (labelGeo.boundingBox.max.x - labelGeo.boundingBox.min.x);
      
      // Position on the front face of the building, near the top
      labelMesh.position.set(lxOffset, b.bHeight - 1, b.bDepth / 2 + 0.1);
      b.group.add(labelMesh);
    });
  });

  // --- PLAYER & ANIMATIONS ---
  let player = null;
  const lastPlayerPos = new THREE.Vector3();
  let mixer = null;
  let animations = {};
  let currentAction = null;

  const gltfLoader = new GLTFLoader();
  
  let modelUrl = "https://threejs.org/examples/models/gltf/Soldier.glb";
  if (user && user.gender === "FEMALE") {
    modelUrl = "https://threejs.org/examples/models/gltf/Xbot.glb";
  }

  gltfLoader.load(modelUrl, (gltf) => {
    if (isDestroyed) return;
    player = gltf.scene;
    player.scale.set(1.5, 1.5, 1.5);
    
    // Explicitly set spawn anchor exactly outside the right-shifted gate
    player.position.set(65, 0, 2); 

    player.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
    scene.add(player);
    lastPlayerPos.copy(player.position);

    // Give it a slightly angled back initial look and set the initial orbit target to player's head
    camera.position.set(65, 10, 22);
    controls.target.copy(player.position).add(new THREE.Vector3(0, 2, 0));
    controls.update();

    mixer = new THREE.AnimationMixer(player);
    gltf.animations.forEach(clip => { 
        let name = clip.name;
        if (name.toLowerCase() === 'idle') name = 'Idle';
        if (name.toLowerCase() === 'walk') name = 'Walk';
        if (name.toLowerCase() === 'run') name = 'Run';
        animations[name] = mixer.clipAction(clip); 
    });
    
    if (animations["Idle"]) {
      currentAction = animations["Idle"];
      currentAction.play();
    }
  });

  // --- INPUT & MOVEMENT ---
  const keys = { w: false, a: false, s: false, d: false, shift: false };
  let isObjectivesOpen = false;

  const handleKey = (e, val) => {
    const key = e.key.toLowerCase() === "shift" ? "shift" : e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = val;
  };
  
  window.addEventListener("keydown", (e) => {
    handleKey(e, true);
    if (e.key.toLowerCase() === "e") {
      if (player && player.position.distanceTo(new THREE.Vector3(-45, 0, -45)) < 55) {
        isObjectivesOpen = !isObjectivesOpen;
        if (callbacks && callbacks.onObjToggle) {
          callbacks.onObjToggle(isObjectivesOpen);
        }
      }
    }
  });
  window.addEventListener("keyup", (e) => handleKey(e, false));

  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  // --- GAME LOOP ---
  const clock = new THREE.Clock();
  const playerVelocity = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3(0, 10, 18);
  let animationId;
  let wasNearPi = false;

  const animate = () => {
    if (isDestroyed) return;
    animationId = requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (player) {
      if (mixer) mixer.update(delta);

      const isNearPi = player.position.distanceTo(new THREE.Vector3(-45, 0, -45)) < 55;
      if (isNearPi !== wasNearPi) {
        wasNearPi = isNearPi;
        if (callbacks && callbacks.onPrompt) callbacks.onPrompt(isNearPi);
        if (!isNearPi && isObjectivesOpen) {
           isObjectivesOpen = false;
           if (callbacks && callbacks.onObjToggle) callbacks.onObjToggle(false);
        }
      }

      const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      cameraForward.y = 0;
      cameraForward.normalize();

      const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      cameraRight.y = 0;
      cameraRight.normalize();

      const moveDir = new THREE.Vector3();
      if (keys.w) moveDir.add(cameraForward);
      if (keys.s) moveDir.sub(cameraForward);
      if (keys.a) moveDir.sub(cameraRight);
      if (keys.d) moveDir.add(cameraRight);

      const isMoving = moveDir.lengthSq() > 0;
      
      if (isMoving) {
        moveDir.normalize();
        const speed = keys.shift ? 16 : 8; // World units per second
        const targetVelocity = moveDir.multiplyScalar(speed);
        
        // Snappy movement: lerp velocity for instant start/stop feel but no sliding
        playerVelocity.lerp(targetVelocity, 0.2); 
        
        // Smooth Rotation (Quaternion)
        const angleOffset = (user && user.gender === "FEMALE") ? 0 : Math.PI;
        const targetAngle = Math.atan2(moveDir.x, moveDir.z) + angleOffset;
        const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), targetAngle);
        player.quaternion.slerp(targetQuaternion, 0.15);

        // Animation Sync
        const animName = keys.shift ? "Run" : "Walk";
        if (animations[animName] && currentAction !== animations[animName]) {
          const prevAction = currentAction;
          currentAction = animations[animName];
          if (prevAction) prevAction.fadeOut(0.2);
          currentAction.reset().fadeIn(0.2).play();
        }
        if (mixer) mixer.timeScale = keys.shift ? 1.5 : 1.0;
      } else {
        playerVelocity.lerp(new THREE.Vector3(0, 0, 0), 0.2);
        if (animations["Idle"] && currentAction !== animations["Idle"]) {
          const prevAction = currentAction;
          currentAction = animations["Idle"];
          if (prevAction) prevAction.fadeOut(0.2);
          currentAction.reset().fadeIn(0.2).play();
        }
      }

      // Apply scaled velocity with Building Collisions
      const oldPosition = player.position.clone();
      player.position.addScaledVector(playerVelocity, delta);

      const playerBox = new THREE.Box3().setFromObject(player);
      let collision = false;
      for (const b of buildingsList) {
        const bBox = new THREE.Box3().setFromObject(b.group);
        if (playerBox.intersectsBox(bBox)) {
          collision = true;
          break;
        }
      }
      
      if (collision) {
        player.position.copy(oldPosition);
      }

      // Camera Follow (Orbit Controls) preserving manual user panning
      const moveDelta = player.position.clone().sub(lastPlayerPos);
      camera.position.add(moveDelta);
      
      controls.target.add(moveDelta);
      controls.update();

      lastPlayerPos.copy(player.position);
    } else {
      controls.update();
    }

    renderer.render(scene, camera);
  };

  animate();

  // --- CLEANUP ---
  return () => {
    isDestroyed = true;
    cancelAnimationFrame(animationId);
    window.removeEventListener("keydown", (e) => handleKey(e, true));
    window.removeEventListener("keyup", (e) => handleKey(e, false));
    window.removeEventListener("resize", handleResize);
    
    renderer.dispose();
    controls.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
  };
}