// Initialize Three.js and create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene and a camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 65;
camera.fov = 110;

camera.updateProjectionMatrix();

// Create the big sphere
const bigSphereGeometry = new THREE.SphereGeometry(2, 32, 32);
const bigSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
scene.add(bigSphere);

const smallSpheresNumber = 3000;

// Create an array to hold the small spheres
const smallSpheres = [];

// Create [smallSpheresNumber] small spheres and add them to the scene
for (let i = 0; i < smallSpheresNumber; i++) {
  const smallSphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
  const smallSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
  scene.add(smallSphere);
  smallSpheres.push(smallSphere);
}

const smallSpherePositions = [];
const smallSphereVelocities = [];
for (let i = 0; i < smallSpheresNumber; i++) {
  const x = Math.random() * 20;
  const y = Math.random() * 20;
  const z = Math.random() * 20;
  const position = new THREE.Vector3(x, y, z);
  smallSpherePositions.push(position);

  const vx = 0;
  const vy = 0;
  const vz = 0;
  const velocity = new THREE.Vector3(vx, vy, vz);
  smallSphereVelocities.push(velocity);
}

// Initialize variables for physics simulation
const bigSpherePosition = new THREE.Vector3(0, 0, 0);
//const smallSpherePosition = new THREE.Vector3(20, 5, 0);
const gravitationalConstant = 5.6;
const tangentialConstant = 0.7;
const maxDistance = 110; // maximum distance from the center for the small spheres
const maxSpeed = 0.9;
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
}



// Render the simulation
function animate() {
  requestAnimationFrame(animate);
   // Calculate the gravitational forces between the big and small spheres
   const gravitationalForces = [];
   for (let i = 0; i < smallSpheresNumber; i++) {
     const distance = bigSpherePosition.distanceTo(smallSpherePositions[i]);
     const direction = bigSpherePosition.clone().sub(smallSpherePositions[i]).normalize();
     const gravitationalForce = direction.multiplyScalar(gravitationalConstant).divideScalar(distance ** 1.7);
     gravitationalForces.push(gravitationalForce);
   }
 
   // Calculate the tangential forces between the big and small spheres
   const tangentialForces = [];
   for (let i = 0; i < smallSpheresNumber; i++) {
     const tangentialForce = smallSphereVelocities[i].clone().cross(gravitationalForces[i]).multiplyScalar(-tangentialConstant);
     tangentialForces.push(tangentialForce);
   }


// Apply the forces to the small spheres
for (let i = 0; i < smallSpheresNumber; i++) {
  smallSphereVelocities[i].add(gravitationalForces[i]).add(tangentialForces[i]);

  // Check if the speed of the small sphere exceeds the maximum speed
  const speed = smallSphereVelocities[i].length();
  if (speed > maxSpeed) {
    // Scale the velocity of the small sphere down to the maximum speed
    smallSphereVelocities[i].divideScalar(speed / maxSpeed);
  }

  smallSpherePositions[i].add(smallSphereVelocities[i]);

  // Check if the small sphere has exceeded the maximum distance from the center
  // if (smallSpherePositions[i].distanceTo(bigSpherePosition) > maxDistance) {
  //   // Reverse the velocity of the small sphere
  //   smallSphereVelocities[i].multiplyScalar(-1);
  // }

  if (smallSpherePositions[i].x > maxDistance){
    smallSphereVelocities[i].x *= -1;
  }
  if (smallSpherePositions[i].y > maxDistance){
    smallSphereVelocities[i].y *= -1;
  }
  if (smallSpherePositions[i].z > maxDistance){
    smallSphereVelocities[i].z *= -1;
  }


  if (smallSpherePositions[i].x < maxDistance * -1){
    smallSphereVelocities[i].x *= -1;
  }
  if (smallSpherePositions[i].y < maxDistance * -1){
    smallSphereVelocities[i].y *= -1;
  }
  if (smallSpherePositions[i].z < maxDistance * -1){
    smallSphereVelocities[i].z *= -1;
  }


  smallSpheres[i].position.copy(smallSpherePositions[i]);
}

  // Update the positions of the spheres
  bigSphere.position.copy(bigSpherePosition);

  // Render the scene
  renderer.render(scene, camera);
}

animate();
