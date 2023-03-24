// Initialize Three.js and create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene and a camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 45;
camera.fov = 100;

camera.updateProjectionMatrix();

// Create the big sphere
const bigSphereGeometry = new THREE.SphereGeometry(2, 32, 32);
const bigSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
scene.add(bigSphere);

// Create an array to hold the small spheres
const smallSpheres = [];

// Create 10 small spheres and add them to the scene
for (let i = 0; i < 10; i++) {
  const smallSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const smallSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
  scene.add(smallSphere);
  smallSpheres.push(smallSphere);
}

// Initialize the positions and velocities of the small spheres
// Initialize the positions of the small spheres
const smallSpherePositions = [
  new THREE.Vector3(50, 0, 50),
  new THREE.Vector3(40, 20, 10),
  new THREE.Vector3(30, -20, 20),
  new THREE.Vector3(20, 40, -10),
  new THREE.Vector3(10, -40, 5),
  new THREE.Vector3(-10, 40, 10),
  new THREE.Vector3(-20, -40, -20),
  new THREE.Vector3(-30, 20, 0),
  new THREE.Vector3(-40, -20, 0),
  new THREE.Vector3(-50, 0, 0)
];


const smallSphereVelocities = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0)
];

// Initialize variables for physics simulation
const bigSpherePosition = new THREE.Vector3(0, 0, 0);
//const smallSpherePosition = new THREE.Vector3(20, 5, 0);
const gravitationalConstant = 3.1;
const tangentialConstant = 0.5;
const maxDistance = 100; // maximum distance from the center for the small spheres
const maxSpeed = 1.5;
const smallSphereVelocity = new THREE.Vector3(0, 0, 0);

// Add mouse controls for moving the big sphere
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(bigSphere);

  bigSpherePosition.set(mouse.x * 50, mouse.y * 50, 0); // Set z-axis to 0 to limit movement to X and Y
  //console.log(mouse.x + ", " + mouse.y);

  // if (intersects.length > 0) {
  //   const point = intersects[0].point;
  //   bigSpherePosition.set(point.x, point.y, 0); // Set z-axis to 0 to limit movement to X and Y
  // }
}



// Render the simulation
function animate() {
  requestAnimationFrame(animate);
   // Calculate the gravitational forces between the big and small spheres
   const gravitationalForces = [];
   for (let i = 0; i < 10; i++) {
     const distance = bigSpherePosition.distanceTo(smallSpherePositions[i]);
     const direction = bigSpherePosition.clone().sub(smallSpherePositions[i]).normalize();
     const gravitationalForce = direction.multiplyScalar(gravitationalConstant).divideScalar(distance ** 2);
     gravitationalForces.push(gravitationalForce);
   }
 
   // Calculate the tangential forces between the big and small spheres
   const tangentialForces = [];
   for (let i = 0; i < 10; i++) {
     const tangentialForce = smallSphereVelocities[i].clone().cross(gravitationalForces[i]).multiplyScalar(-tangentialConstant);
     tangentialForces.push(tangentialForce);
   }


// Apply the forces to the small spheres
for (let i = 0; i < 10; i++) {
  smallSphereVelocities[i].add(gravitationalForces[i]).add(tangentialForces[i]);

  // Check if the speed of the small sphere exceeds the maximum speed
  const speed = smallSphereVelocities[i].length();
  if (speed > maxSpeed) {
    // Scale the velocity of the small sphere down to the maximum speed
    smallSphereVelocities[i].divideScalar(speed / maxSpeed);
  }

  smallSpherePositions[i].add(smallSphereVelocities[i]);

  // Check if the small sphere has exceeded the maximum distance from the center
  if (smallSpherePositions[i].distanceTo(bigSpherePosition) > maxDistance) {
    // Reverse the velocity of the small sphere
    smallSphereVelocities[i].multiplyScalar(-1);
  }

  smallSpheres[i].position.copy(smallSpherePositions[i]);
}

  // Update the positions of the spheres
  bigSphere.position.copy(bigSpherePosition);

  // Render the scene
  renderer.render(scene, camera);
}

animate();

//   // Apply the forces to the small sphere
//   smallSphereVelocity.add(gravitationalForce).add(tangentialForce);
//   smallSpherePosition.add(smallSphereVelocity);

//   // Update the positions of the spheres
//   bigSphere.position.copy(bigSpherePosition);
//   smallSphere.position.copy(smallSpherePosition);

//   // Render the scene
//   renderer.render(scene, camera);
// }

animate();

