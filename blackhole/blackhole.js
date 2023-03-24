const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackhole = new THREE.Mesh(geometry, material);
scene.add(blackhole);

const particleGeometry = new THREE.SphereGeometry(0.05, 6, 6);
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const particles = [];
const particleCount = 10000; // Increase the particle count to 10,000

for (let i = 0; i < particleCount; i++) {
  const particle = new THREE.Mesh(particleGeometry, particleMaterial);
  particle.position.set(Math.random() * 20 - 10, Math.random() * 2 - 1, Math.random() * 20 - 10);
  scene.add(particle);
  particles.push(particle);
}

camera.position.z = 30; // Move the camera further away

const tiltAngle = Math.PI / 6; // Tilt the disc by 30 degrees
const tiltAxis = new THREE.Vector3(1, 0, 0);
particles.forEach((particle) => {
  particle.position.applyAxisAngle(tiltAxis, tiltAngle);
});

const animate = function () {
  requestAnimationFrame(animate);

  particles.forEach((particle) => {
    const distance = particle.position.distanceTo(blackhole.position);
    const force = (1 / (distance * distance)) * 10;
    const direction = blackhole.position.clone().sub(particle.position).normalize().multiplyScalar(force);

    particle.position.add(direction);

    const angle = 0.001; // Reduced the speed of the spinning particles
    particle.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    particle.position.applyAxisAngle(tiltAxis, tiltAngle);
  });

  renderer.render(scene, camera);
};

animate();
