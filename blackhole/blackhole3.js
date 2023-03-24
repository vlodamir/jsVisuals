const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackhole = new THREE.Mesh(geometry, material);
scene.add(blackhole);

const particleCount = 5000;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 5 + Math.random() * 10;
  const ellipticalFactor = 1.5;
  const tilt = Math.PI / 6;
  const yOffset = Math.random() * 2 - 1;

  positions[i] = Math.cos(angle) * distance * ellipticalFactor;
  positions[i + 1] = yOffset;
  positions[i + 2] = Math.sin(angle) * distance;

  const grayValue = Math.random();
  colors[i] = grayValue;
  colors[i + 1] = grayValue;
  colors[i + 2] = grayValue;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

camera.position.z = 20;
camera.position.y = 5;
camera.rotation.x = -Math.PI / 6;

const gravitationalForce = 0.851;

const animate = function () {
  requestAnimationFrame(animate);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const dx = blackhole.position.x - positions[i];
    const dy = blackhole.position.y - positions[i + 1];
    const dz = blackhole.position.z - positions[i + 2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const force = gravitationalForce / (distance * distance);

    positions[i] += dx * force;
    positions[i + 1] += dy * force;
    positions[i + 2] += dz * force;
  }

  particleGeometry.attributes.position.needsUpdate = true;

  particles.rotation.y += 0.01;
  renderer.render(scene, camera);
};

animate();
