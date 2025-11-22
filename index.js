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
        
        <!-- LIBRARIES -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        
        <!-- FONTS -->
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Montserrat:wght@300;400;600&family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
        
        <style>
            :root {
                /* ZORO PALETTE */
                --c-zoro-green: #00ff88;   /* Neon Spirit Green */
                --c-zoro-dark: #022b15;    /* Deep Forest Green */
                --c-void: #010502;         /* Blackest Green */
                
                --c-glass: rgba(5, 20, 10, 0.9);
                --c-glass-border: rgba(0, 255, 136, 0.3);
                
                --c-text: #f0fff5;
                --c-text-muted: #88aa99;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; cursor: none; }

            body {
                background-color: var(--c-void);
                color: var(--c-text);
                font-family: 'Montserrat', sans-serif;
                height: 100vh;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                /* Deep Abyssal Gradient */
                background-image: radial-gradient(circle at 50% 100%, #0a1a10 0%, #000000 80%);
            }

            /* --- CUSTOM CURSOR --- */
            .cursor-follower {
                position: fixed;
                top: 0; left: 0; width: 40px; height: 40px;
                border: 1px solid var(--c-zoro-green);
                transform: translate(-50%, -50%) rotate(45deg); 
                pointer-events: none;
                z-index: 9999;
                transition: width 0.2s, height 0.2s, border-color 0.3s;
                mix-blend-mode: exclusion;
            }
            .cursor-dot {
                position: fixed;
                top: 0; left: 0; width: 4px; height: 4px;
                background: var(--c-zoro-green);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px var(--c-zoro-green);
            }

            /* --- BACKGROUND CANVAS --- */
            #webgl-canvas {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 0;
            }

            /* --- THE MONOLITH (Cyber-Samurai Edition) --- */
            .monolith {
                position: relative;
                width: 1100px;
                height: 650px;
                
                /* Deep Green Obsidian with subtle Grid */
                background-color: rgba(2, 10, 5, 0.95);
                background-image: 
                    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
                background-size: 40px 40px;
                
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                
                border: 1px solid var(--c-glass-border);
                border-right: 2px solid var(--c-zoro-green); 
                border-radius: 4px;
                
                display: grid;
                grid-template-columns: 1.2fr 1fr;
                
                box-shadow: 
                    0 40px 100px -10px rgba(0, 0, 0, 0.9), 
                    0 0 40px rgba(0, 255, 136, 0.1);
                
                z-index: 10;
                overflow: hidden;
            }

            /* Vertical Accent Line */
            .monolith::before {
                content: "";
                position: absolute;
                top: 0; left: 0; width: 4px; height: 100%;
                background: linear-gradient(to bottom, transparent, var(--c-zoro-green), transparent);
                z-index: 20;
                opacity: 0.5;
            }

            /* --- LEFT SIDE: DATA --- */
            .data-col {
                padding: 70px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
                z-index: 5;
            }

            /* Header */
            .header-meta {
                display: flex;
                align-items: center;
                margin-bottom: 40px;
                border-bottom: 1px solid rgba(0, 255, 136, 0.2);
                padding-bottom: 15px;
                width: fit-content;
            }
            .rank-id {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.8rem;
                color: var(--c-zoro-green);
                letter-spacing: 4px;
            }

            /* Name */
            .identity-block { margin-bottom: 50px; }
            
            .identity-block h1 {
                font-family: 'Cinzel', serif;
                font-size: 3.5rem;
                line-height: 0.9;
                color: #fff;
                margin-bottom: 10px;
                background: linear-gradient(to right, #fff, #aaddcc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            }

            .identity-block h2 {
                font-family: 'Montserrat', sans-serif;
                font-size: 1rem;
                color: var(--c-zoro-green);
                letter-spacing: 6px;
                text-transform: uppercase;
                font-weight: 600;
                display: flex;
                align-items: center;
            }
            
            .identity-block h2::before {
                content: '///';
                margin-right: 10px;
                color: #444;
            }

            /* Grid Stats */
            .stats-grid {
                display: flex;
                align-items: center;
                gap: 30px;
                margin-bottom: 50px;
                padding: 25px;
                background: rgba(0, 255, 136, 0.03);
                border-left: 3px solid var(--c-zoro-green);
                border-radius: 0 4px 4px 0;
            }

            /* Sharp Profile Frame */
            .avatar-container {
                width: 90px; height: 90px;
                position: relative;
                clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
                background: var(--c-zoro-green);
                padding: 2px;
            }
            
            .avatar-img {
                width: 100%; height: 100%;
                object-fit: cover;
                clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
                background: #000;
                filter: grayscale(0.3) contrast(1.2);
            }

            .details { display: flex; flex-direction: column; gap: 12px; }
            
            .detail-row { display: flex; flex-direction: column; }
            
            .detail-label {
                font-size: 0.65rem;
                color: var(--c-text-muted);
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 2px;
            }
            
            .detail-value { 
                font-size: 1.1rem; 
                font-weight: 600; 
                letter-spacing: 1px; 
                color: #fff; 
                font-family: 'Montserrat', sans-serif;
            }

            /* Special styling for Program */
            .tech-value {
                font-family: 'Orbitron', sans-serif;
                color: var(--c-zoro-green);
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
            }

            /* Bounty */
            .bounty-section {
                position: relative;
            }
            .bounty-label {
                font-family: 'Cinzel', serif;
                font-size: 0.8rem;
                color: var(--c-text-muted);
                letter-spacing: 2px;
            }
            .bounty-val {
                font-family: 'Cinzel', serif;
                font-size: 3rem;
                color: #fff;
                font-weight: 700;
                letter-spacing: 2px;
                text-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
            }

            /* --- RIGHT SIDE: ZORO VISUAL --- */
            .visual-col {
                position: relative;
                overflow: hidden;
                background: #000;
                /* Diagonal Slash Mask */
                clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
            }

            .hero-img-container {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
            }

            .hero-img {
                width: 100%; height: 100%;
                object-fit: cover;
                object-position: top center;
                opacity: 0.85;
                transition: transform 0.5s ease, filter 0.5s ease;
                filter: saturate(0.8) contrast(1.2);
            }

            .monolith:hover .hero-img { 
                transform: scale(1.03); 
                filter: saturate(1.1) contrast(1.2);
            }

            /* Quote Overlay */
            .quote-container {
                position: absolute;
                bottom: 0; left: 0; width: 100%;
                padding: 60px 40px;
                background: linear-gradient(to top, rgba(0, 20, 10, 0.95), transparent);
                z-index: 10;
            }

            .quote-text {
                font-family: 'Cinzel', serif;
                font-size: 1.4rem;
                line-height: 1.4;
                color: #e0ffe0;
                margin-bottom: 15px;
                font-style: italic;
                border-left: 2px solid var(--c-zoro-green);
                padding-left: 20px;
            }

            .quote-author {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.85rem;
                color: var(--c-zoro-green);
                letter-spacing: 4px;
                text-transform: uppercase;
                font-weight: 700;
                padding-left: 20px;
            }

            /* --- MOBILE RESPONSIVE --- */
            @media (max-width: 1100px) {
                .monolith { 
                    width: 90vw; height: auto; 
                    grid-template-columns: 1fr; 
                    margin: 20px 0;
                }
                .visual-col { 
                    height: 400px; order: 1; 
                    clip-path: none;
                    border-bottom: 2px solid var(--c-zoro-green);
                }
                .data-col { order: 2; padding: 40px; }
                .stats-grid { flex-direction: column; align-items: flex-start; }
            }
        </style>
    </head>
    <body>

        <!-- CURSOR -->
        <div class="cursor-follower"></div>
        <div class="cursor-dot"></div>

        <!-- BACKGROUND -->
        <canvas id="webgl-canvas"></canvas>

        <!-- MAIN CARD -->
        <div class="monolith" id="card">
            
            <!-- DATA SIDE (LEFT) -->
            <div class="data-col">
                <div class="header-meta">
                    <span class="rank-id">NO. ${userData.section} // HUNTER</span>
                </div>

                <div class="identity-block">
                    <h1>${userData.name}</h1>
                    <h2>${userData.role}</h2>
                </div>

                <div class="stats-grid">
                    <div class="avatar-container">
                        <img src="${myImage}" class="avatar-img" alt="Profile">
                    </div>
                    <div class="details">
                        <div class="detail-row">
                            <span class="detail-label">Major</span>
                            <span class="detail-value">Service Management</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Program</span>
                            <span class="detail-value tech-value">Information Technology</span>
                        </div>
                    </div>
                </div>

                <div class="bounty-section">
                    <div class="bounty-label">Current Bounty</div>
                    <div class="bounty-val" id="bounty-display">0</div>
                </div>
            </div>

            <!-- VISUAL SIDE (RIGHT) -->
            <div class="visual-col">
                <div class="hero-img-container">
                    <img src="${zoroImage}" class="hero-img" alt="Roronoa Zoro">
                </div>
                
                <div class="quote-container">
                    <p class="quote-text">"${userData.quote}"</p>
                    <div class="quote-author">${userData.author}</div>
                </div>
            </div>

        </div>

        <script>
            // --- 1. BOUNTY COUNTER ---
            // Simple counter logic
            const bountyElement = document.getElementById('bounty-display');
            const targetBounty = 500000000;
            const duration = 2000; 
            const startTimestamp = performance.now();

            function step(timestamp) {
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentVal = Math.floor(easeOutQuart * targetBounty);
                bountyElement.innerText = "฿ " + currentVal.toLocaleString();

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            }
            window.requestAnimationFrame(step);

            // --- 2. CUSTOM CURSOR ---
            const cursorFollower = document.querySelector('.cursor-follower');
            const cursorDot = document.querySelector('.cursor-dot');
            const monolith = document.getElementById('card');

            window.addEventListener('mousemove', (e) => {
                const x = e.clientX;
                const y = e.clientY;
                
                gsap.to(cursorDot, { x: x, y: y, duration: 0.1 });
                gsap.to(cursorFollower, { x: x, y: y, duration: 0.4, ease: 'power2.out' });

                // Subtle Tilt
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const tiltX = (y - centerY) / 80;
                const tiltY = (centerX - x) / 80;

                gsap.to(monolith, { 
                    rotationX: tiltX, 
                    rotationY: tiltY, 
                    duration: 1, 
                    ease: 'power2.out' 
                });
            });

            // --- 3. THREE.JS BACKGROUND (Green Spirit Embers) ---
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x010502, 0.002);

            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas'), alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Particles
            const particlesCount = 1200;
            const posArray = new Float32Array(particlesCount * 3);
            
            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 30; // Spread
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.03,
                color: 0x00ff88, // Neon Green
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            
            const particlesMesh = new THREE.Points(geometry, material);
            scene.add(particlesMesh);
            camera.position.z = 5;

            // Animation
            const clock = new THREE.Clock();
            let mouseX = 0; 
            let mouseY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX / window.innerWidth - 0.5;
                mouseY = e.clientY / window.innerHeight - 0.5;
            });

            function animate() {
                const elapsedTime = clock.getElapsedTime();
                particlesMesh.position.y = Math.sin(elapsedTime * 0.2) * 0.5;
                particlesMesh.rotation.y = -0.05 * elapsedTime; 
                particlesMesh.rotation.x = mouseY * 0.1;
                particlesMesh.rotation.y += mouseX * 0.1;
                
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
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
  console.log(`🏴‍☠️ Setting sail on port ${port}`);
});