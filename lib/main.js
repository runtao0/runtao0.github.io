import Grid from './grid';
import Plane from './plane';
import * as Patterns from './patterns';

// For testing purposes
// window.preloaded = function () {
//   console.log(preloaded);
// }
//
// window.lifeTracker = function () {
//   console.log(lifeTracker);
// }
//
// window.objects = function () {
//   console.log(objects);
// }

let camera, controls, scene, renderer, width, height, grid, plane;
width = window.innerWidth;
height = window.innerHeight;
scene = new THREE.Scene();

let raycaster = new THREE.Raycaster();
let isShiftDown = false;
let mouse = new THREE.Vector2();
let tick = 5;
let rows = 50, cols = 50;
let objects = [];
let preloaded = [];
const lifeTracker = {};
const userCreated = {};

const rollOverGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
const rollOverMaterial = new THREE.MeshBasicMaterial( { color: "#ffffff", opacity: 0.5, transparent: true } );
const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
const normalMaterial = new THREE.MeshNormalMaterial({
  opacity: 1,
  transparent: true,
});

window.start = function() {
  createScene();
  addPlane();
  createLifeTracker();
  createControls();
  createRenderer();
  createRollOver();
  addEssentialEvents();
  animateStartButton();
  addGliderGunButton();
  addCrossButton();
  addRandomButton();
  addGardenButton();
}

window.animate = function() {
  controls.update();
  requestAnimationFrame( animate );
  step();
  render();
}

function render() {
  renderer.render( scene, camera )
}

function step() {
  if (tick < 1505) {
    if(tick % 5 === 0) {
      // scene.remove(grid.grid);
      grid.step(tick/5);
      camera.position.set(0, camera.position.y + 2, camera.position.z + 7)
      scene.add(grid.grid);
    }
  }
  tick += 5;
}

function addEssentialEvents() {
  document.addEventListener( "mousemove", onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );
  document.addEventListener( 'keyup', onDocumentKeyUp, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function animateStartButton() {
  const startButton = document.getElementById( "start_button" );
  startButton.addEventListener( 'click', () => {
    scene.remove( rollOverMesh );
    document.removeEventListener( "mousemove", onDocumentMouseMove, false );
    document.removeEventListener( 'mousedown', onDocumentMouseDown, false );
    document.removeEventListener( 'keydown', onDocumentKeyDown, false );
    document.removeEventListener( 'keyup', onDocumentKeyUp, false );
    grid = new Grid( rows, cols, lifeTracker );
    animate();
  });
}

function addGliderGunButton() {
  const gliderGunButton = document.getElementById( "glider_gun" );
  gliderGunButton.addEventListener( 'click', createGliderGun );
}

function createGliderGun() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.shiftGliderGunY( 10 ) ); });
  addBlocks();
}

function addCrossButton() {
  const crossButton = document.getElementById( "cross" );
  crossButton.addEventListener( 'click', createCross );
}

function createCross() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.createCross( 50 ) ); });
  addBlocks();
}

function addRandomButton() {
  const randomButton = document.getElementById("random");
  randomButton.addEventListener('click', createRandom);
}

function createRandom() {
  makeGrid( initRandom );
  addBlocks();
}

function addGardenButton() {
  const gardenButton = document.getElementById( "garden" );
  gardenButton.addEventListener( 'click', createGarden );
}

function createGarden() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.GARDEN_EDEN ); });
  addBlocks();
}

function initPattern( x, y, coord, pattern ) {
  if ( isPatternBlock( x, y, pattern ) ) {
    lifeTracker[coord] = true;
  } else {
    if ( !userCreated.hasOwnProperty( coord ) ) {
      lifeTracker[coord] = false;
    }
  }
}

function initRandom( x, y, coord ) {
  const lifeNum = Math.floor( Math.random() * 100 );
  if( lifeNum <= 15 ) {
    lifeTracker[coord] = true;
  } else {
    if ( !userCreated.hasOwnProperty( coord ) ) {
      lifeTracker[coord] = false;
    }
  }
}

function isPatternBlock( x, y, pattern ) {
  if ( pattern.hasOwnProperty( x ) ) {
    if ( pattern[x].indexOf( y ) > -1 ) return true;
  }
  return false;
}

function createScene() {
  const light = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( light )
  scene.fog = new THREE.Fog( "#bdbdbd", 1, 1200 );
  camera = new THREE.PerspectiveCamera( 45, width / height, 1, 5000 );
  camera.position.set( 0, -550, 250 );
  camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
}

function createControls() {
  controls = new THREE.TrackballControls( camera );
  controls.addEventListener( "change", render );
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( "#bdbdbd", 1 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( width, height );
  document.body.append( renderer.domElement );
}

function createRollOver() {
  scene.add( rollOverMesh );
}

function addBlocks() {
  grid = new Grid( rows, cols, lifeTracker );
  preloaded = preloaded.concat( grid.grid );
  objects = objects.concat( grid.grid );
  for ( let i = 0; i < grid.grid.length; i++ ) {
    scene.add( grid.grid[i] );
  }
}

function addPlane() {
  plane = new Plane( rows, cols );
  objects.push( plane.plane );
  scene.add( plane.plane );
  scene.add( plane.grid );
}

function createLifeTracker() {
  for( let x = 0; x < rows; x++ ) {
    for( let y = 0; y < cols; y++ ) {
      lifeTracker[`${ x },${ y }`] = false;
    }
  }
}

function interateLifeTracker( callback ) {
  Object.keys( lifeTracker ).forEach( ( coord ) => {
    const coordArray = coord.split( "," );
    const x = parseInt( coordArray[0] );
    const y = parseInt( coordArray[1] );

    callback( x, y, coord );
  });
}

function makeGrid ( initCallback ) {
  preloaded.forEach(( cell ) => {
    scene.remove( cell );
  });
  preloaded = [];
  interateLifeTracker(( x, y, coord ) => {
    initCallback(x, y, coord);
  });
}

function createBox( x, y ) {
  const gridY = ( y - 5 + 250 ) / 10,
    gridX = ( x - 5 + 250 ) / 10,
    box = new THREE.Mesh( rollOverGeo,
                          // new THREE.MeshBasicMaterial({
                          //   color: 'rgb(' + ~~((gridY / 50) * 255) + ', ' + ~~((gridX / 50) * 255) + ', 255)',
                          //   opacity: 1,
                          //   transparent: true,
                          // })
                          normalMaterial
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
    const intersect = intersects[0];
    rollOverMesh.position.copy( intersect.point );
    rollOverMesh.position.divideScalar( 10 ).floor().multiplyScalar( 10 ).addScalar( 5 );
    rollOverMesh.position.z = 5;
    if ( rollOverMesh.position.x < -250 ) rollOverMesh.position.x = -250;
    if ( rollOverMesh.position.y < -250 ) rollOverMesh.position.y = -250;

  }
  render();
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  const gridX = ( rollOverMesh.position.x - 5 + 250 ) / 10;
  const gridY = ( rollOverMesh.position.y - 5 + 250 ) / 10;
  mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    const intersect = intersects[ 0 ];
    // delete cube
    if ( isShiftDown ) {
      if ( intersect.object != plane.plane ) {
        scene.remove( intersect.object );
        objects.splice( objects.indexOf( intersect.object ), 1 );
        delete userCreated[`${ gridX },${ gridY }`];
        lifeTracker[`${ gridX },${ gridY }`] = false;
      }
    // create cube
    } else {
      const cell = createBox(rollOverMesh.position.x, rollOverMesh.position.y);
      lifeTracker[`${ gridX },${ gridY }`] = true;
      userCreated[`${ gridX },${ gridY }`] = true;
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
