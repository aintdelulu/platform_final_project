import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

// --- USER DATA ---
const userData = {
    name: "Edgar Carandang",
    role: "Cloud Practitioner / Dev",
    section: "BSIT SM 4102",
    bounty: 500000000, 
    quote: "When the world shoves you around, you just gotta stand up and shove back.",
    author: "Roronoa Zoro"
};

// --- IMAGES ---
const myImage = "/edgar.jpeg";
const zoroImage = "/zoro.jpeg"; 

app.get('/', (req, res) => {
  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>King of Hell: ${userData.name}</title>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Montserrat:wght@300;400;600&family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                /* ZORO PALETTE */
                --c-zoro-green: #00ff88;   
                --c-zoro-dark: #022b15;    
                --c-void: #010502;         
                
                --c-glass: rgba(2, 20, 10, 0.85);
                --c-glass-border: rgba(0, 255, 136, 0.5);
                --c-text: #f0fff5;
                --c-text-muted: #88aa99;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
                background-color: var(--c-void);
                color: var(--c-text);
                font-family: 'Montserrat', sans-serif;
                height: 100vh;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background-image: radial-gradient(circle at 50% 100%, #0f2e1e 0%, #000000 90%);
            }

            /* --- BACKGROUND --- */
            #webgl-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }

            /* --- THE SLASHED INTERFACE --- */
            .main-container {
                position: relative;
                width: 1200px;
                height: 650px; /* Increased height slightly to fit the bigger avatar */
                z-index: 10;
                display: flex;
                justify-content: center;
                align-items: center;
                perspective: 1200px; 
            }

            .slashed-card {
                position: relative;
                width: 100%;
                height: 100%;
                background: var(--c-glass);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--c-glass-border);
                
                /* THE UNIQUE SHAPE */
                clip-path: polygon(
                    5% 0%, 
                    100% 0%, 
                    100% 85%, 
                    95% 100%, 
                    0% 100%, 
                    0% 15%
                );
                
                display: grid;
                grid-template-columns: 1.3fr 1fr;
                box-shadow: 0 0 50px rgba(0, 255, 136, 0.1);
                overflow: hidden;
                transform-style: preserve-3d;
            }

            /* The Glowing Slash Line */
            .slash-line {
                position: absolute;
                top: -50%;
                left: 55%;
                width: 2px;
                height: 200%;
                background: var(--c-zoro-green);
                transform: rotate(15deg);
                z-index: 20;
                box-shadow: 0 0 20px var(--c-zoro-green);
                opacity: 0.7;
                pointer-events: none;
            }

            /* --- LEFT: INFO HUD --- */
            .info-panel {
                padding: 40px 60px; /* Reduced top/bottom padding to make room */
                display: flex;
                flex-direction: column;
                justify-content: center; /* Center content vertically */
                position: relative;
                z-index: 5;
            }

            /* Big Watermark Bounty */
            .watermark-bounty {
                position: absolute;
                top: 20%;
                left: -20px;
                font-family: 'Orbitron', sans-serif;
                font-size: 9rem;
                font-weight: 900;
                color: rgba(0, 255, 136, 0.04);
                z-index: -1;
                white-space: nowrap;
                pointer-events: none;
                letter-spacing: -5px;
            }

            .header-row {
                display: flex;
                align-items: center;
                gap: 15px;
                border-bottom: 1px solid rgba(0, 255, 136, 0.3);
                padding-bottom: 15px;
                width: fit-content;
                margin-bottom: 25px;
            }
            .status-dot { width: 8px; height: 8px; background: var(--c-zoro-green); border-radius: 50%; box-shadow: 0 0 10px var(--c-zoro-green); }
            .status-text { font-family: 'Orbitron'; font-size: 0.8rem; letter-spacing: 3px; color: var(--c-zoro-green); }

            /* --- NEW AVATAR POSITION --- */
            .avatar-lockup {
                width: 180px;  /* Bigger Size */
                height: 180px; /* Bigger Size */
                position: relative;
                margin-bottom: 20px; /* Space between image and name */
                flex-shrink: 0;
            }

            .hex-avatar {
                width: 100%; height: 100%;
                object-fit: cover;
                /* Hexagon Shape */
                clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                background: #111;
                filter: grayscale(0.2) contrast(1.1);
                transition: filter 0.3s;
                position: relative;
                z-index: 2;
            }
            
            /* Decorative border for the hex */
            .avatar-lockup::after {
                content: '';
                position: absolute;
                top: -2px; left: -2px; right: -2px; bottom: -2px;
                background: var(--c-zoro-green);
                clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                z-index: 1;
                opacity: 0.5;
            }

            .main-identity h1 {
                font-family: 'Cinzel', serif;
                font-size: 3.8rem;
                line-height: 0.9;
                color: #fff;
                text-shadow: 2px 2px 0px var(--c-zoro-dark);
                margin-bottom: 10px;
            }
            .main-identity h2 {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.1rem;
                color: var(--c-zoro-green);
                letter-spacing: 4px;
                text-transform: uppercase;
            }

            .stats-row {
                display: flex;
                gap: 40px;
                margin-top: 30px;
            }
            .stat-box { display: flex; flex-direction: column; }
            .stat-label { font-size: 0.7rem; color: var(--c-text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;}
            .stat-val { font-size: 1.1rem; font-weight: 600; font-family: 'Orbitron'; color: #fff; border-left: 3px solid var(--c-zoro-green); padding-left: 10px; }

            /* --- RIGHT: VISUAL --- */
            .visual-panel {
                position: relative;
                height: 100%;
                clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
                margin-left: -40px; 
                background: #000;
            }

            .bg-zoro {
                width: 100%; height: 100%;
                object-fit: cover;
                object-position: top center;
                opacity: 0.6;
                filter: grayscale(100%) contrast(1.2);
                transition: all 0.5s ease;
            }
            .slashed-card:hover .bg-zoro {
                opacity: 0.9;
                filter: grayscale(20%) contrast(1.2);
                transform: scale(1.05);
            }
            
            /* Quote styling */
            .quote-box {
                position: absolute;
                bottom: 40px;
                left: 40px;
                width: 80%;
                text-align: right;
                z-index: 25;
            }
            .quote-text {
                font-family: 'Montserrat', sans-serif;
                font-style: italic;
                font-size: 0.9rem;
                color: #fff;
                background: rgba(0,0,0,0.7);
                padding: 10px;
                border-right: 3px solid var(--c-zoro-green);
            }

            .bounty-active-display {
                position: absolute;
                top: 30px;
                right: 30px;
                text-align: right;
                z-index: 30;
            }
            .bounty-label-sm { font-size: 0.7rem; letter-spacing: 2px; color: var(--c-zoro-green); }
            .bounty-val-sm { font-family: 'Orbitron'; font-size: 1.5rem; font-weight: 700; color: #fff; }

            /* --- MOBILE --- */
            @media (max-width: 1000px) {
                .main-container { width: 95vw; height: auto; }
                .slashed-card { grid-template-columns: 1fr; height: auto; clip-path: none; border-radius: 10px; }
                .visual-panel { height: 300px; clip-path: none; margin-left: 0; order: 1; border-bottom: 2px solid var(--c-zoro-green); }
                .info-panel { order: 2; padding: 30px; align-items: center; text-align: center; }
                .header-row { margin: 0 auto 20px auto; }
                .stats-row { justify-content: center; }
                .stat-val { border-left: none; border-bottom: 3px solid var(--c-zoro-green); padding-left: 0; padding-bottom: 5px; }
                .slash-line { display: none; }
                .watermark-bounty { display: none; }
            }
        </style>
    </head>
    <body>

        <canvas id="webgl-canvas"></canvas>

        <div class="main-container" id="card-wrapper">
            <div class="slashed-card" id="card-inner">
                
                <div class="slash-line"></div>

                <div class="info-panel">
                    <div class="watermark-bounty" id="watermark">0</div>
                    
                    <div class="header-row">
                        <div class="status-dot"></div>
                        <span class="status-text">SYSTEM ONLINE // ${userData.section}</span>
                    </div>

                    <div class="avatar-lockup">
                        <img src="${myImage}" class="hex-avatar" alt="Edgar">
                    </div>

                    <div class="main-identity">
                        <h1>${userData.name}</h1>
                        <h2>${userData.role}</h2>
                    </div>

                    <div class="stats-row">
                        <div class="stat-box">
                            <span class="stat-label">Program</span>
                            <span class="stat-val">Information Technology</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Major</span>
                            <span class="stat-val">Service Management</span>
                        </div>
                    </div>
                </div>

                <div class="visual-panel">
                    <img src="${zoroImage}" class="bg-zoro" alt="Zoro Background">
                    
                    <div class="bounty-active-display">
                        <div class="bounty-label-sm">ACTIVE BOUNTY</div>
                        <div class="bounty-val-sm" id="bounty-real">0</div>
                    </div>

                    <div class="quote-box">
                        <p class="quote-text">"${userData.quote}"</p>
                    </div>
                </div>

            </div>
        </div>

        <script>
            // --- 1. BOUNTY ANIMATION ---
            const waterMarkEl = document.getElementById('watermark');
            const realBountyEl = document.getElementById('bounty-real');
            const target = ${userData.bounty};
            
            const duration = 2500;
            const start = performance.now();

            function updateBounty(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 5); 
                
                const current = Math.floor(ease * target);
                
                waterMarkEl.innerText = current.toLocaleString();
                realBountyEl.innerText = "฿ " + current.toLocaleString();

                if (progress < 1) requestAnimationFrame(updateBounty);
            }
            requestAnimationFrame(updateBounty);

            // --- 2. MOUSE PARALLAX ---
            const inner = document.getElementById('card-inner');
            const zoroBg = document.querySelector('.bg-zoro');
            // Target the new avatar class for parallax
            const avatar = document.querySelector('.avatar-lockup'); 

            document.addEventListener('mousemove', (e) => {
                const x = e.clientX;
                const y = e.clientY;
                
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                
                const dx = (x - cx) / 65; 
                const dy = (y - cy) / 65;

                gsap.to(inner, { 
                    rotationY: dx, 
                    rotationX: -dy, 
                    duration: 1, 
                    ease: "power2.out" 
                });

                // Parallax elements
                gsap.to(zoroBg, { x: dx * 1.5, y: dy * 1.5, duration: 1.2 });
                gsap.to(avatar, { x: dx * 0.5, y: dy * 0.5, duration: 1.2 }); // Subtle movement for avatar
            });

            // --- 3. PARTICLES ---
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas'), alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.position.z = 5;

            const count = 800;
            const positions = new Float32Array(count * 3);
            for(let i=0; i<count*3; i++) {
                positions[i] = (Math.random() - 0.5) * 25;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size: 0.04,
                color: 0x00ff88,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);

            function animate() {
                requestAnimationFrame(animate);
                particles.rotation.y += 0.001;
                particles.rotation.x += 0.0005;
                particles.position.y = Math.sin(Date.now() * 0.0005) * 0.2;
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        </script>
    </body>
    </html>
  `;

  res.send(htmlResponse);
});

app.listen(port, () => {
  console.log(`⚔️  Zoro is lost again... but running on port ${port}`);
});