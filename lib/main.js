import Grid from './grid';
import Plane from './plane';

window.start = start;
window.animate = animate;
window.objects = function () {
  console.log(objects);
}
window.camera = function () {
  console.log(camera.position);
}
window.step = function () {
  if (tick < 1005) {
    if(tick % 5 === 0) {
      // scene.remove(grid.grid);
      camera.position.x += 2;
      camera.position.z += 10;
      grid.step(tick/5);
      scene.add(grid.grid)
    }
  }
  tick += 5;
}

let camera, controls, scene, renderer, width, height, grid, plane;
width = window.innerWidth;
height = window.innerHeight;
scene = new THREE.Scene();

let raycaster = new THREE.Raycaster();
let isShiftDown = false;
let mouse = new THREE.Vector2();
let tick = 5;
let rows, cols = 45;
const objects = [];

const rollOverGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
const rollOverMaterial = new THREE.MeshBasicMaterial( { color: "#ffffff", opacity: 0.5, transparent: true } );
const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );

function start() {
  console.log("started");

  createScene();
  addPlane();
  addBlocks();
  createControls();
  createRenderer();
  createRollOver();
  document.addEventListener("mousemove", onDocumentMouseMove, false);
}

function createScene() {
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light)

  // scene.fog = new THREE.Fog("#bdbdbd", 1, 1500);

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 340, 0, 680 );
  camera.lookAt( new THREE.Vector3(0,0,0) );
}

function createControls() {
  controls = new THREE.TrackballControls(camera);
  controls.addEventListener("change", render);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#bdbdbd", 1);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(width, height);
  document.body.append(renderer.domElement);
}

function createRollOver() {
  scene.add( rollOverMesh );
}

function addBlocks() {
  grid = new Grid();
  scene.add(grid.grid);
}

function addPlane() {
  plane = new Plane();
  objects.push(plane.plane);
  scene.add(plane.plane);
  scene.add(plane.grid)
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // if (tick < 1005) {
  //   if(tick % 5 === 0) {
  //     // scene.remove(grid.grid);
  //     camera.position.x += 2;
  //     camera.position.z += 5;
  //     grid.step(tick/5);
  //     scene.add(grid.grid);
  //   }
  // }
  render();
  // tick++;
}

function render() {
  renderer.render(scene, camera)
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    const intersect = intersects[ 0 ];
    rollOverMesh.position.copy( intersect.point );
    rollOverMesh.position.divideScalar( 450/45 ).floor().multiplyScalar( 450/45 ).addScalar(0);
    rollOverMesh.position.z = 5;
    if (rollOverMesh.position.x < -220) rollOverMesh.position.x = -220;
    if (rollOverMesh.position.y < -220) rollOverMesh.position.y = -220;

  }
  render();
}
