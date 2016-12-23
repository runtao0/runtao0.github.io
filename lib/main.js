import Grid from './grid'

let camera, controls, scene, renderer, width, height;
width = window.innerWidth;
height = window.innerHeight;

function start() {
  console.log("started");

  scene = new THREE.Scene();

  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 0, 100 );
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 0.1;
  spotLight.shadowMapWidth = 2048;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadowDarkness = 0.1;

  const spotLight2 = new THREE.SpotLight( 0xffffff );
  spotLight2.position.set( 0, 0, -100 );
  spotLight2.castShadow = true;
  spotLight2.shadowCameraNear = 0.1;
  spotLight2.shadowMapWidth = 2048;
  spotLight2.shadowMapHeight = 2048;
  spotLight2.shadowDarkness = 0.1;
  scene.add(spotLight);
  scene.add(spotLight2);
  const grid = new Grid();
  scene.add(grid.grid);

  camera = new THREE.PerspectiveCamera(45, width / height, .1, 10000);
  camera.position.z = 500;

  controls = new THREE.TrackballControls(camera);
  controls.addEventListener("change", render);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.append(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function render() {
  renderer.render(scene, camera)
}

window.start = start;
window.animate = animate;

// var tick = 0,


// function step() {
// 	spotLight.position.x = Math.sin( tick / 100 ) * ( worldWidth / 2 );
// 	spotLight.position.y = Math.cos( tick / 100 ) * ( worldHeight / 2 );
//
// 	// cubes.traverse( function( cube ) {
// 	// 	if( cube instanceof THREE.Mesh ) {
// 	// 		if( Math.abs( cube.scale.z - cube.zScaleTarget ) > 0.001 ) {
// 	// 			cube.scale.z += ( cube.zScaleTarget - cube.scale.z ) * 0.05;
// 	// 		} else {
// 	// 			cube.zScaleTarget = 1 + Math.random() * 10;
// 	// 		}
// 	// 		cube.position.z = cube.geometry.parameters.depth / 2 * cube.scale.z;
// 	// 	}
// 	// });
//
// 	tick++;
// }
