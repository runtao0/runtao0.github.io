import Grid from './grid';
import Plane from './plane';
import * as Patterns from './patterns';

// TODO: compare lifetrackers to see if something has run to completion

let camera, controls, scene, renderer, width, height, grid, plane;
width = window.innerWidth;
height = window.innerHeight;
scene = new THREE.Scene();

let raycaster = new THREE.Raycaster();
let isShiftDown = false;
let started = false;
let mouse = new THREE.Vector2();
let tick = 5;
let rows = 100, cols = 100;
let objects = [];
let preloaded = [];
const lifeTracker = {};
const userCreated = {};

const rollOverGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
const rollOverMaterial = new THREE.MeshBasicMaterial( { color: "#ffffff", opacity: 0.5, transparent: true } );
const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
const normalMaterial = new THREE.MeshNormalMaterial({
  opacity: 1,
  transparent: false,
});

$( () => {
  createScene();
  addPlane();
  createLifeTracker();
  createControls();
  createRenderer();
  createRollOver();

  const $buttons = $(".buttons");
  $(document).on( "mousemove", onDocumentMouseMove )
    .on( "mousedown", onDocumentMouseDown)
    .on( "keydown", onDocumentKeyDown)
    .on( "keyup", onDocumentKeyUp);
  window.addEventListener( 'resize', onWindowResize, false );

  $buttons.on("click", "button", event => {
    event.preventDefault();
    switch(event.target.id) {
      case 'start_button':
        if (countLife()) {
          onStart(event.target);
        } else {
          const error = $("<h2>Add more blocks for life to happen!</h2>");
          error.addClass("error")
          $("body").append(error);
        }
        break;
      case 'glider_gun':
        createGliderGun();
        break;
      case 'cross':
        createCross();
        break;
      case 'benchmark':
        createBenchmark();
        break;
      case 'garden':
        createGarden();
        break;
      case 'growthgun':
        createGrowthGun();
        break;
      case 'random':
        createRandom();
        break;
    }
  });
});

function animate() {
  controls.update();
  requestAnimationFrame( animate );
  if(started) {
    step();
  }
}

function countLife() {
  let count = 0;
  for(let x in lifeTracker) {
    if (lifeTracker[x]) count ++;
  }
  return count > 10;
}

function step() {
  if(tick % 5 === 0) {
    grid.step(tick/5);
    camera.position.set(camera.position.x, camera.position.y + 2, camera.position.z + 7)
    scene.add(grid.grid);
  }
  tick += 5;
}

function render() {
  renderer.render( scene, camera )
}


function removeEvents() {
  $(document).off();
  $(".buttons").off();
  $(".buttons").on("click", event => {
    event.preventDefault()
    if (event.target.id === "start_button") onStart(event.target);
  });
  $("#sidebar").on("mouseenter", () => {
    $("header").animate({left:0}, {duration:1000});
  }).on("mouseleave", () => {
    $("header").animate({left:"-100%"}, {duration:1000});
  })
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
  interateLifeTracker((x, y, coord) => {
    initCallback(x, y, coord);
  });
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

function isPatternBlock( x, y, pattern ) {
  if ( pattern.hasOwnProperty( x ) ) {
    if ( pattern[x].indexOf( y ) > -1 ) return true;
  }
  return false;
}

function initRandom( x, y, coord ) {
  const lifeNum = Math.floor( Math.random() * 100 );
  if( lifeNum <= 12 ) {
    lifeTracker[coord] = true;
  } else {
    if ( !userCreated.hasOwnProperty( coord ) ) {
      lifeTracker[coord] = false;
    }
  }
}

// Pattern Buttons

function onStart(element) {
  $(".error").remove();
  setTimeout(() => {
    $("header").animate({left:"-100%"}, {duration:2000});
  }, 3000);
  const val = started ?  "Start!" : "Pause!";
  element.classList.toggle("green");
  element.classList.toggle("red");
  element.innerHTML = val;
  started = !started;
  scene.remove( rollOverMesh );
  removeEvents();
  if (grid) {
    grid = new Grid( rows, cols, grid.lifeTracker );
  } else {
    grid = new Grid( rows, cols, lifeTracker );
  }
  animate();
}

function createGliderGun() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.shiftPattern( Patterns.GLIDER_GUN, 20, 30 ) ); });
  addBlocks();
}

function createCross() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.createCross( 100 ) ); });
  addBlocks();
}

function createBenchmark() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.createBenchmark( 50, 100 ) ); });
  addBlocks();
}

function createRandom() {
  makeGrid( initRandom );
  addBlocks();
}

function createGarden() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.shiftPattern(Patterns.GARDEN_EDEN, 20, 30)) });
  addBlocks();
}

function createGrowthGun() {
  makeGrid( ( x, y, coord ) => { initPattern( x, y, coord, Patterns.shiftPattern(Patterns.GROWTH_GUN, 50, 30)) });
  addBlocks();
}

// important helpers

function createScene() {
  const light = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( light )
  camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
  camera.position.set( 0, -1000, 700 );
  camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
}

function createControls() {
  controls = new THREE.TrackballControls( camera );
  controls.addEventListener( "change", render );
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( "#9c9999", 1 );
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

function createBox( x, y ) {
  const gridY = ( y - 5 + 500 ) / 10,
    gridX = ( x - 5 + 500 ) / 10,
    box = new THREE.Mesh( rollOverGeo,
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
    if ( rollOverMesh.position.x < -500 ) rollOverMesh.position.x = -500;
    if ( rollOverMesh.position.y < -500 ) rollOverMesh.position.y = -500;

  }
  render();
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  const gridX = ( rollOverMesh.position.x - 5 + 500 ) / 10;
  const gridY = ( rollOverMesh.position.y - 5 + 500 ) / 10;
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
