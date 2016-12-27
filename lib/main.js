import Grid from './grid';
import Plane from './plane';

window.start = start;
// window.animate = animate;
window.objects = function () {
  console.log(objects);
}
window.camera = function () {
  console.log(camera.position);
}
window.rollOver = function () {
  console.log(rollOverMesh.position);
}
window.step = function () {
  if (tick < 1005) {
    if(tick % 5 === 0) {
      // scene.remove(grid.grid);
      grid.step(tick/5);
      camera.position.set(0, camera.position.y + 2, camera.position.z + 7)
      scene.add(grid.grid);
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
let rows = 45, cols = 45;
const objects = [];
const lifeTracker = {};

const rollOverGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
const rollOverMaterial = new THREE.MeshBasicMaterial( { color: "#ffffff", opacity: 0.5, transparent: true } );
const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );

function start() {
  console.log("started");

  createScene();
  // addPlane();
  createLifeTracker();
  addBlocks();
  createControls();
  createRenderer();
  // createRollOver();
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );
  animateStartButton();
  window.addEventListener( 'resize', onWindowResize, false );
}

function animateStartButton() {
  const start_button = document.getElementById("start_button");
  start_button.addEventListener('onclick', animate, true);
}

function createScene() {
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light)

  // scene.fog = new THREE.Fog("#bdbdbd", 1, 1500);

  camera = new THREE.PerspectiveCamera( 45, width / height, 1, 5000 );
  camera.position.set( 0, -480, 225 );
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
  grid = new Grid( rows, cols, lifeTracker );
  scene.add(grid.grid);
}

function addPlane() {
  plane = new Plane();
  objects.push(plane.plane);
  scene.add(plane.plane);
  scene.add(plane.grid)
}

function createLifeTracker() {
  for(let x = 0; x < rows; x++) {
    for(let y = 0; y < cols; y++) {
      lifeTracker[`${x},${y}`] = false;
    }
  }
}

window.animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  window.step();
  render();
}

function render() {
  renderer.render(scene, camera)
}

function createBox(x, y) {
  const gridY = (y - 5 + 225) / 10,
    gridX = (x - 5 + 225) / 10,
    box = new THREE.Mesh( new THREE.BoxBufferGeometry(10, 10, 10),
                          new THREE.MeshBasicMaterial({
                            color: 'rgb(' + ~~((gridY / 45) * 255) + ', ' + ~~((gridX / 45) * 255) + ', 255)',
                            opacity: 1,
                            transparent: true,
                          })
                        );
    box.position.set(
      x,
      y,
      5
    );

  return box;
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

function onDocumentMouseDown( event ) {
  event.preventDefault();
  const gridX = (rollOverMesh.position.x - 5 + 225) / 10;
  const gridY = (rollOverMesh.position.y - 5 + 225) / 10;
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    const intersect = intersects[ 0 ];
    // delete cube
    if ( isShiftDown ) {
      if ( intersect.object != plane.plane ) {
        scene.remove( intersect.object );
        lifeTracker[`${gridX},${gridY}`] = false;
      }
    // create cube
    } else {
      const cell = createBox(rollOverMesh.position.x, rollOverMesh.position.y);
      lifeTracker[`${gridX},${gridY}`] = true;
      scene.add( cell );
      objects.push( cell );
    }
    console.log(`x: ${gridX}, y: ${gridY}`);
    console.log(lifeTracker);
    render();
  }
}

function onDocumentKeyDown( event ) {
  switch( event.keyCode ) {
    case 16: isShiftDown = true;
      break;
  }
}

function onDocumentKeyUp( event ) {
  switch ( event.keyCode ) {
    case 16: isShiftDown = false;
      break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
