// js/three-scene.js

// Import THREE from the global window object where it's attached after importmap
// Alternatively, if you host Three.js locally, you'd import it directly:
// import * as THREE from '../node_modules/three/build/three.module.js';

const THREE = window.THREE; // Accessing the global THREE object

let scene, camera, renderer, particles;
let animationFrameId; // To store the requestAnimationFrame ID

function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) {
        console.error("Three.js canvas element not found!");
        return;
    }

    // Scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xf5f5f5); // Optional: Set a background color, or leave null for transparency

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Clear color black, 0 opacity for transparency

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Dynamic Particle System
    const numParticles = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const color1 = new THREE.Color(0x356aff); // Primary color
    const color2 = new THREE.Color(0x0d2d86); // Dark primary color
    const colorWhite = new THREE.Color(0xffffff);
    const colorGrey = new THREE.Color(0x888888);

    for (let i = 0; i < numParticles; i++) {
        // Positions (randomly distributed in a sphere)
        const radius = Math.random() * 10 + 2; // Vary radius for more depth
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Colors (mix between primary colors and white/grey for variation)
        const mixedColor = new THREE.Color();
        if (Math.random() > 0.5) {
            mixedColor.lerpColors(color1, colorWhite, Math.random());
        } else {
            mixedColor.lerpColors(color2, colorGrey, Math.random());
        }
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.08, // Smaller particles
        vertexColors: true, // Use colors from geometry attribute
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending // Makes particles glow when overlapping
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize, false);

    // Mouse/Touch Interaction
    window.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

    // Initial render
    animate();
}

// Mouse interaction variables
let mouseX = 0, mouseY = 0;
const targetX = 0, targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault(); // Prevent scrolling
        mouseX = (event.touches[0].pageX - windowHalfX);
        mouseY = (event.touches[0].pageY - windowHalfY);
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Animate particles based on mouse position
    if (particles) {
        // Subtle rotation
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        // Add subtle movement based on mouse
        // particles.rotation.y += (mouseX * 0.00001) ;
        // particles.rotation.x += (mouseY * 0.00001) ;

        // Make particles slightly drift
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(Date.now() * 0.00005 + i) * 0.0001;
            positions[i + 1] += Math.cos(Date.now() * 0.00005 + i) * 0.0001;
            // positions[i + 2] += Math.sin(Date.now() * 0.00005 + i) * 0.00005; // Less Z movement
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Function to handle dark mode switching for the Three.js scene
export function setThreeSceneDarkMode(isDarkMode) {
    if (particles && particles.material) {
        const primaryColorLight = new THREE.Color(0x356aff);
        const primaryColorDark = new THREE.Color(0x0d2d86);
        const white = new THREE.Color(0xffffff);
        const grey = new THREE.Color(0x888888);

        const colors = particles.geometry.attributes.color.array;
        const numParticles = colors.length / 3;

        for (let i = 0; i < numParticles; i++) {
            const mixedColor = new THREE.Color();
            if (isDarkMode) {
                // Shift colors towards darker tones
                mixedColor.lerpColors(primaryColorDark, grey, Math.random() * 0.5);
            } else {
                // Shift colors towards lighter tones
                mixedColor.lerpColors(primaryColorLight, white, Math.random() * 0.5);
            }
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }
        particles.geometry.attributes.color.needsUpdate = true; // Tell Three.js to update colors
    }

    // You could also change the clear color or add/remove a background plane here
    // For transparent background, we don't set a scene.background
    // if (isDarkMode) {
    //     renderer.setClearColor(0x111116, 1); // A very dark background if not transparent
    // } else {
    //     renderer.setClearColor(0xf5f5f5, 1); // A light background
    // }
}

// Export the init function for use in script.js
export { initThreeScene };

// Cleanup on page unload (optional, for SPA scenarios)
// window.addEventListener('beforeunload', () => {
//     if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//     }
//     if (renderer) {
//         renderer.dispose();
//     }
//     window.removeEventListener('resize', onWindowResize);
//     window.removeEventListener('mousemove', onDocumentMouseMove);
//     window.removeEventListener('touchmove', onDocumentTouchMove);
// });