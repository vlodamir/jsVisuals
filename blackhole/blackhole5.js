const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshBasicMaterial({
	color: 0x000000
});
const blackhole = new THREE.Mesh(geometry, material);
scene.add(blackhole);

const particleCount = 300000;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
	const angle = Math.random() * Math.PI * 2;
	const distance = 5 + Math.random() * 10;
	const sphericalCoords = new THREE.Spherical(distance, Math.random() * Math.PI, angle);
	const position = new THREE.Vector3().setFromSpherical(sphericalCoords);

	positions[i] = position.x;
	positions[i + 1] = position.y;
	positions[i + 2] = position.z;

	const grayValue = Math.random();
	colors[i] = grayValue;
	colors[i + 1] = grayValue;
	colors[i + 2] = grayValue;

	const startingSpeed = 0.05;
	const dx = blackhole.position.x - positions[i];
	const dy = blackhole.position.y - positions[i + 1];
	const dz = blackhole.position.z - positions[i + 2];
	const direction = new THREE.Vector3(dx, dy, dz).normalize();
	const tangent = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 1)).normalize();

	velocities[i] = tangent.x * startingSpeed;
	velocities[i + 1] = tangent.y * startingSpeed;
	velocities[i + 2] = tangent.z * startingSpeed;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
	size: 0.1,
	vertexColors: true
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

camera.position.z = 20;
camera.position.y = 5;
camera.rotation.x = -Math.PI / 6;

const gravitationalForce = 0.251;
const minDistanceFromBlackHole = 0.05;

const animate = function () {
	requestAnimationFrame(animate);

	for (let i = 0; i < particleCount * 3; i += 3) {
		const dx = blackhole.position.x - positions[i] * 2;
		const dy = blackhole.position.y - positions[i + 1] * 1.1;
		const dz = blackhole.position.z - positions[i + 2] * 1.1;
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
		const force = gravitationalForce / (distance * distance);

		//if (distance > minDistanceFromBlackHole) {
			const accelerationX = dx * force;
			const accelerationY = dy * force;
			const accelerationZ = dz * force;

			// Compute the velocity perpendicular to the acceleration (i.e., tangential velocity for circular orbits)
			const direction = new THREE.Vector3(dx, dy, dz).normalize();
			const tangent = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

			// Update the position using the sum of the acceleration and tangential velocity
			positions[i] += accelerationX + tangent.x * 0.01;
			positions[i + 1] += accelerationY + tangent.y * 0.01;
			positions[i + 2] += accelerationZ + tangent.z * 0.01;

			// Update the position using the sum of the acceleration and tangential velocity
			positions[i] += accelerationX + velocities[i];
			positions[i + 1] += accelerationY + velocities[i + 1];
			positions[i + 2] += accelerationZ + velocities[i + 2];
		//}
	}

	particleGeometry.attributes.position.needsUpdate = true;

	renderer.render(scene, camera);
};

animate();
