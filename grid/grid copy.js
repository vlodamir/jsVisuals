// Initialize the scene, camera and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 2;
camera.position.y = -5;
camera.rotation.x = 1.3;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create the points
var points = [];
var gridSize = 10;
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

// Create the lines
var lines = [];
for ( var i = 0; i < gridSize; i ++ ) {
    for ( var j = 0; j < gridSize - 1; j ++ ) {
        var line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( [
                points[ i * gridSize + j ],
                points[ i * gridSize + j + 1 ]
            ] ),
            new THREE.LineBasicMaterial( { color: 0xffffff } )
        );
        scene.add( line );
        lines.push( line );
    }
}
for ( var i = 0; i < gridSize - 1; i ++ ) {
    for ( var j = 0; j < gridSize; j ++ ) {
        var line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( [
                points[ i * gridSize + j ],
                points[ ( i + 1 ) * gridSize + j ]
            ] ),
            new THREE.LineBasicMaterial( { color: 0xffffff } )
        );
        scene.add( line );
        lines.push( line );
    }
}

// Randomly move the points up and down
function animatePoints() {
    for ( var i = 0; i < points.length; i ++ ) {
        points[ i ].z = Math.sin( Date.now() / 1000 + i ) * 0.5;

        
    }
}

// Render the scene
function animate() {
    requestAnimationFrame( animate );
    animatePoints();
    renderer.render( scene, camera );
}
animate();
