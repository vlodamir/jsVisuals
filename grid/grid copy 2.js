// Initialize the scene, camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 2;
camera.position.y = -5;
camera.rotation.x = 1.3;
camera.fov = 90;

camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create the points
var points = [];
var gridSize = 5;
var spacing = 0.5;
for ( var i = 0; i < gridSize; i ++ ) {
    for ( var j = 0; j < gridSize; j ++ ) {
        var point = new THREE.Vector3(
            ( i - ( gridSize / 2 ) ) * spacing,
            ( j - ( gridSize / 2 ) ) * spacing,
            0
        );
        points.push( point );
    }
}

// Create the point cloud
var geometry = new THREE.BufferGeometry().setFromPoints( points );
var material = new THREE.PointsMaterial( { size: 0.05, color: 0xffffff } );
var pointCloud = new THREE.Points( geometry, material );
scene.add( pointCloud );

// Create the lines
var lineGeometry = new THREE.BufferGeometry();
var positions = new Float32Array( ( gridSize * ( gridSize - 1 ) + ( gridSize - 1 ) * gridSize ) * 6 );
var index = 0;
for ( var i = 0; i < gridSize; i ++ ) {
    for ( var j = 0; j < gridSize - 1; j ++ ) {
        positions[ index ++ ] = points[ i * gridSize + j ].x;
        positions[ index ++ ] = points[ i * gridSize + j ].y;
        positions[ index ++ ] = points[ i * gridSize + j ].z;
        positions[ index ++ ] = points[ i * gridSize + j + 1 ].x;
        positions[ index ++ ] = points[ i * gridSize + j + 1 ].y;
        positions[ index ++ ] = points[ i * gridSize + j + 1 ].z;
    }
}
for ( var i = 0; i < gridSize - 1; i ++ ) {
    for ( var j = 0; j < gridSize; j ++ ) {
        positions[ index ++ ] = points[ i * gridSize + j ].x;
        positions[ index ++ ] = points[ i * gridSize + j ].y;
        positions[ index ++ ] = points[ i * gridSize + j ].z;
        positions[ index ++ ] = points[ ( i + 1 ) * gridSize + j ].x;
        positions[ index ++ ] = points[ ( i + 1 ) * gridSize + j ].y;
        positions[ index ++ ] = points[ ( i + 1 ) * gridSize + j ].z;
    }
}
lineGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
var lineSegments = new THREE.LineSegments( lineGeometry, lineMaterial );
scene.add( lineSegments );

// Create the sphere
var sphereGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.y = 5;
scene.add( sphere );

// Add mouse controls for moving the sphere
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


// Add the event listener to update the sphere's position
document.addEventListener( 'mousemove', function ( event ) {
    var movementX = event.movementX || 0;
    var movementY = event.movementY || 0;
    sphere.position.x += movementX / 100;
    sphere.position.z -= movementY / 100;

    movementZ =  (event.movementX || 0 )/ 250;
    //console.log(movementZ)
    //sphere.position.y += movementZ;
} );


// Randomly move the points up and down
function animatePoints() {
    for ( var i = 0; i < points.length; i ++ ) {
        var point = points[ i ];
        var distanceToSphere = point.distanceTo(sphere.position);

        //console.log(Math.pow(distanceToSphere,2))

        // - Math.pow(distanceToSphere,4)/1000)

        point.z = (Math.sin( Date.now() / 1000 + i) * 0.4);

       //console.log(distanceToSphere)

       var alteredZ = point.z + Math.pow(distanceToSphere,4)/1000;


        // Update the position of the point in the geometry
        geometry.attributes.position.setXYZ( i, point.x, point.y, alteredZ);
    }

    // Notify Three.js that the geometry has changed
    geometry.attributes.position.needsUpdate = true;

    // Update the position data in the lineGeometry object
    var linePositions = lineGeometry.attributes.position.array;
    var index = 0;
    for ( var i = 0; i < gridSize; i ++ ) {
        for ( var j = 0; j < gridSize - 1; j ++ ) {
            linePositions[ index ++ ] = points[ i * gridSize + j ].x;
            linePositions[ index ++ ] = points[ i * gridSize + j ].y;
            linePositions[ index ++ ] = points[ i * gridSize + j ].z;
            linePositions[ index ++ ] = points[ i * gridSize + j + 1 ].x;
            linePositions[ index ++ ] = points[ i * gridSize + j + 1 ].y;
            linePositions[ index ++ ] = points[ i * gridSize + j + 1 ].z;
        }
    }
    for ( var i = 0; i < gridSize - 1; i ++ ) {
        for ( var j = 0; j < gridSize; j ++ ) {
            linePositions[ index ++ ] = points[ i * gridSize + j ].x;
            linePositions[ index ++ ] = points[ i * gridSize + j ].y;
            linePositions[ index ++ ] = points[ i * gridSize + j ].z;
            linePositions[ index ++ ] = points[ ( i + 1 ) * gridSize + j ].x;
            linePositions[ index ++ ] = points[ ( i + 1 ) * gridSize + j ].y;
            linePositions[ index ++ ] = points[ ( i + 1 ) * gridSize + j ].z;
        }
    }

    // Notify Three.js that the lineGeometry has changed
    lineGeometry.attributes.position.needsUpdate = true;
}


// Render the scene
function animate() {
    requestAnimationFrame( animate );
    animatePoints();
    renderer.render( scene, camera );
}
animate();
