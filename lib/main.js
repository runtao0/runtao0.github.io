import Grid from './grid'

let camera, controls, scene, renderer, width, height;
width = window.innerWidth;
height = window.innerHeight;
scene = new THREE.Scene();

let tick = 5;
let grid = new Grid();
let rows = 50;
let cols = 50;

function start() {
  console.log("started");

  scene.add(grid.grid);

  const ambience = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambience)

  // scene.fog = new THREE.Fog("#bdbdbd", 1, 800);

  // camera = new THREE.PerspectiveCamera(45, width / height, .1, 10000);
  // camera.position.z = 300;
  // camera.position.x = 600;
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 340, 0, 680 );
  camera.lookAt( new THREE.Vector3() );

  controls = new THREE.TrackballControls(camera);
  controls.addEventListener("change", render);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#bdbdbd", 1);
  renderer.setSize(width, height);
  document.body.append(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (tick < 1005) {
    if(tick % 5 === 0) {
      // scene.remove(grid.grid);
      camera.position.z += 5
      grid.step(tick/5);
      scene.add(grid.grid)
    }
  }
  render();
  tick++;
}

function render() {
  renderer.render(scene, camera)
}

window.step = function () {
  if (tick < 1005) {
    if(tick % 5 === 0) {
      // scene.remove(grid.grid);
      camera.position.z += 10;
      grid.step(tick/5);
      scene.add(grid.grid)
    }
  }
  tick++;
}

window.camera = function () {
  console.log(camera.position);
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
