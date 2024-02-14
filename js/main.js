import * as THREE from 'three';

// Toggle Menu
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);

    // Add event listeners to each menu item in the overlay
    document.querySelectorAll('#mobile-menu-overlay ul li').forEach(item => {
        item.addEventListener('click', toggleMenu);
    });
});

function toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
  
    var overlay = $("#mobile-menu-overlay");
    if (overlay.is(":visible")) {
        overlay.fadeOut(500).promise().done(function() {
            // This will be called after fadeOut completes
            console.log("Menu hidden");
        });
    } else {
        overlay.fadeIn(500).promise().done(function() {
            // This will be called after fadeIn completes
            console.log("Menu shown");
        });
    }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Set clear color to black (or any color you want), with full transparency

// Getting the container in which you want to add your canvas
const container = document.getElementById('canvas-container');

// Append the renderer's canvas element to the container
container.appendChild(renderer.domElement);

const onWindowResize = () => {
    // Check if we are in mobile view
    const mobileView = window.innerWidth <= 932; // Use the same breakpoint as in your CSS

    if (mobileView) {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
        camera.aspect = (window.innerWidth / 2) / window.innerHeight;
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
    }
    camera.updateProjectionMatrix();
};

// Make sure you update the camera aspect ratio and the renderer size
// if the window is resized
window.addEventListener('resize', onWindowResize, false);


// Create the main sphere
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, // this can be any color
    wireframe: false,
    transparent: true, // this enables transparency
    opacity: 0 // this controls the level of transparency, set between 0 (fully transparent) and 1 (fully opaque)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Create the black orbs
const orbGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const orbMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const orbs = [];
for (let i = 0; i < 3; i++) {
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orbs.push(orb);
    scene.add(orb);
}

// Create a group to hold the trail particles
const trailGroup = new THREE.Group();
scene.add(trailGroup);

// Function to create a single trail particle
function createTrailParticle(position) {
    const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(position);
    trailGroup.add(particle);

    // Set a property to track the particle's lifetime
    particle.lifetime = 1;
    return particle;
}

// Array to store the trail particles
let trailParticles = [];

// Update function for the trail particles
function updateTrailParticles() {
    // Create new particles at the position of each orb
    orbs.forEach(orb => {
        const newParticle = createTrailParticle(orb.position);
        trailParticles.push(newParticle);
    });

    // Update existing particles
    trailParticles.forEach(particle => {
        particle.lifetime -= 0.01; // Reduce lifetime
        if (particle.lifetime <= 0) {
            // Remove the particle from the scene and the array
            trailGroup.remove(particle);
            trailParticles = trailParticles.filter(p => p !== particle);
        } else {
            // Update the particle's opacity
            particle.material.opacity = particle.lifetime;
            particle.material.transparent = particle.lifetime < 1;
            // Scale down the particle's size for a fading effect
            particle.scale.multiplyScalar(0.95);
        }
    });
}

let angle = 0;
const animate = function () {
    requestAnimationFrame(animate);

    angle += 0.04;
    orbs[0].position.set(5 * Math.sin(angle), 5 * Math.cos(angle), 2);
    orbs[1].position.set(0, 5 * Math.sin(angle), 5 * Math.cos(angle));
    orbs[2].position.set(5 * Math.cos(angle), 0, 5 * Math.sin(angle));

    // Update trail particles in each frame
    updateTrailParticles();

    renderer.render(scene, camera);
};

// Handle window resizing

animate();

camera.position.z = 20;
renderer.render(scene, camera);

