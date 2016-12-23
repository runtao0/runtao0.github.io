import Grid from './grid'

let camera, controls, scene, renderer, width, height;
width = window.innerWidth;
height = window.innerHeight;
scene = new THREE.Scene();

let tick = 0;
let grid = new Grid();

function start() {
  console.log("started");

  const ambience = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambience)

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
  if(tick % 10 === 0) {
    scene.remove(grid.grid)
    grid.step();
    scene.add(grid.grid)
  }
  render();
  tick++;
}

window.step = function () {
  scene.remove(grid.grid);
    grid.step();

    scene.add(grid.grid);
}
function render() {
  renderer.render(scene, camera)
}

window.start = start;
window.animate = animate;

function createStandardSpotlight(x = 0, y = 0, z = 100) {
  const spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set(x, y, z);
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 0.1;
  spotLight.shadowMapWidth = 2048;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadowDarkness = 0.1;
  scene.add(spotLight);
}

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
