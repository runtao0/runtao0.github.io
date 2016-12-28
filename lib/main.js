import Grid from './grid';
import Plane from './plane';
import * as Patterns from './patterns';

window.start = start;
// window.animate = animate;
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

window.preloaded = function () {
  console.log(preloaded);
}

window.lifeTracker = function () {
  console.log(lifeTracker);
}

window.objects = function () {
  console.log(objects);
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
let objects = [];
let preloaded = [];
const lifeTracker = {};

const rollOverGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
const rollOverMaterial = new THREE.MeshBasicMaterial( { color: "#ffffff", opacity: 0.5, transparent: true } );
const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );

function start() {
  console.log("started");

  createScene();
  addPlane();
  createLifeTracker();
  // addBlocks();
  createControls();
  createRenderer();
  createRollOver();
  addEssentialEvents();
  animateStartButton();
  addGliderGunButton();
  addCrossButton();
  addRandomButton();
}

function addEssentialEvents() {
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function animateStartButton() {
  const startButton = document.getElementById("start_button");
  startButton.addEventListener('click', animate);
}

function addGliderGunButton() {
  const gliderGunButton = document.getElementById("glider_gun");
  gliderGunButton.addEventListener('click', createGliderGun);
}

function createGliderGun() {
  makeGrid(initGliderGun);
  addBlocks();

}

function addCrossButton() {
  const cross = document.getElementById("cross");
  cross.addEventListener('click', animate);
}

function addRandomButton() {
  const startButton = document.getElementById("random");
  cross.addEventListener('click', animate);
}

function createScene() {
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light)
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

function isPatternBlock(x, y, pattern) {
  if (pattern.hasOwnProperty(x)) {
    if (pattern[x].indexOf(y) > -1) {
      return true;
    }
  }
  return false;
}

function addBlocks() {
  grid = new Grid( rows, cols, lifeTracker );
  preloaded = preloaded.concat(grid.grid);
  objects = objects.concat(grid.grid);
  for ( let i = 0; i < grid.grid.length; i++ ) {
    scene.add(grid.grid[i]);
  }
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

function interateLifeTracker(callback) {
  Object.keys(lifeTracker).forEach((coord) => {
    const coordArray = coord.split(",");
    const x = parseInt(coordArray[0]);
    const y = parseInt(coordArray[1]);

    callback(x, y, coord);
  });
}

function makeGrid (initCallback) {
  preloaded.forEach((cell) => {
    scene.remove(cell);
  });
  interateLifeTracker(( x, y, coord ) => {
    initCallback(x, y, coord);
  });
}

function initRandom(x, y, coord) {
  const lifeNum = Math.floor(Math.random() * 100)

  if(lifeNum <= 15) {
    scene.add(createBox(x, y));
    preloaded.push(createBox(x, y));
    lifeTracker[coord] = true;
  } else {
    lifeTracker[coord] = false;
  }
}

function initGliderGun(x, y, coord) {
  if (isPatternBlock(x, y, Patterns.shiftGliderGunY(10))) {
    // scene.add(createBox(x, y));
    // preloaded.push(createBox(x, y));
    lifeTracker[coord] = true;
  } else {
    lifeTracker[coord] = false;
  }
  // grid = new Grid(lifeTracker);
}

function initCross(x, y, coord) {
  if (isPatternBlock(x, y, Patterns.createCross(rows))) {
    scene.add(createBox(x, y));
    preloaded.push(createBox(x, y));
    lifeTracker[coord] = true;
  } else {
    lifeTracker[coord] = false;
  }
}

window.animate = function(e) {
  controls.update();
  requestAnimationFrame(animate);
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
    box.position.set( x, y, 5 );

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
