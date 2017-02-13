import Grid from './grid';
import Scene from './scene'
import LifeTracker from "./life_tracker";
import Plane from './plane';
import * as Patterns from './patterns';

// TODO: compare lifetrackers to see if something has run to completion

$(() => {
  const scene = new Scene(window.innerWidth, window.innerHeight);
  let firstTime = true;
  let isShiftDown = false;
  let started = false;

  let rows = 100, cols = 100;
  let objects = [];
  const lifeTracker = scene.grid.lifeTracker;
  const userCreated = new LifeTracker();

  scene.setUpSceneAll(objects);

  const $buttons = $(".buttons");
  $(document).on( "mousemove", onDocumentMouseMove )
    .on( "mousedown", onDocumentMouseDown)
    .on( "keydown", onDocumentKeyDown)
    .on( "keyup", onDocumentKeyUp);
  window.addEventListener( 'resize', scene.onWindowResize.bind(scene), false );

  $buttons.on("click", "button", event => {
    event.preventDefault();
    switch(event.target.id) {
      case 'start_button':
        if (firstTime) {
          if (lifeTracker.countLife()) {
            onStart(event.target);
          } else {
            const error = $("<h2>Add more blocks for life to happen!</h2>");
            error.addClass("error")
            $("body").append(error);
          }
        } else {
          const val = started ?  "Start!" : "Pause!";
          event.target.classList.toggle("green");
          event.target.classList.toggle("red");
          event.target.innerHTML = val;
          started = !started;
        }
        break;
      case 'glider_gun':
        createPattern(Patterns.shiftPattern( Patterns.GLIDER_GUN, 20, 30 ));
        break;
      case 'cross':
        createPattern(Patterns.createCross( 100 ) );
        break;
      case 'benchmark':
        createPattern(Patterns.createBenchmark( 50, 100 ));
        break;
      case 'garden':
        createPattern(Patterns.shiftPattern(Patterns.GARDEN_EDEN, 20, 30));
        break;
      case 'growthgun':
        createPattern(Patterns.shiftPattern(Patterns.GROWTH_GUN, 50, 30));
        break;
      case 'random':
        createRandom();
        break;
    }
  });

function animate() {
  scene.controls.update();
  requestAnimationFrame( animate );
  if(started) {
    scene.step();
  }
}

function onStart(element) {
  removeEvents();
    setTimeout(() => {
      $("header").animate({left:"-100%"}, {duration:2000});
    }, 3000);

  started = !started;
  firstTime = false;
  element.classList.toggle("green");
  element.classList.toggle("red");
  element.innerHTML = "Pause!";

  scene.removeRollOver();
  animate();
}

function removeEvents() {
  $(document).off();
  $(".error").remove();
  $("#glider_gun").remove();
  $("#cross").remove();
  $("#benchmark").remove();
  $("#garden").remove();
  $("#growthgun").remove();
  $("#random").remove();
  $("#sidebar").on("mouseenter", () => {
    $("header").animate({ left: 0 }, { duration: 1000 });
  }).on("mouseleave", () => {
    $("header").animate({ left: "-100%" }, { duration: 1000 });
  })
}

// making patterns helper methods

function translatePatternToLifeTracker(pattern) {
  lifeTracker.iterate((x, y, coord) => {
    if (userCreated.isAlive(coord)) {
      lifeTracker.setAlive(x, y)
    } else {
      if (isSquareAlive(x, y, pattern)) {
          lifeTracker.setAlive(x, y);
        } else{
          lifeTracker.setDead(x, y);
        }
      }
  });
}

function isSquareAlive( x, y, pattern ) {
  if ( pattern.hasOwnProperty( x ) ) {
    if ( pattern[x].indexOf( y ) > -1 ) return true;
  }
  return false;
}


function createPattern(pattern) {
  scene.clearPrevious();
  translatePatternToLifeTracker(pattern);
  scene.makeGrid();
  scene.addBlocks();
}

function createRandom() {
  scene.clearPrevious();
  lifeTracker.random();
  scene.makeGrid();
  scene.addBlocks();
}

// voxel painter event listeners

function onDocumentMouseMove( event ) {
  event.preventDefault();
  scene.setMouse(( event.clientX / window.innerWidth ) * 2 - 1,
               - ( event.clientY / window.innerHeight ) * 2 + 1 );
  scene.setRayfromCamera();
  const intersects = scene.getIntersectObjects( objects );
  if ( intersects.length > 0 ) {
    const intersect = intersects[0];
    scene.setRollOverMesh( intersect.point );
  }
  scene.render();
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  const gridX = scene.rollOverXPos();
  const gridY = scene.rollOverYPos();
  scene.setMouse(( event.clientX / window.innerWidth ) * 2 - 1,
               - ( event.clientY / window.innerHeight ) * 2 + 1 );
  scene.setRayfromCamera();
  const blockIntersects = scene.getIntersectObjects( scene.grid.cells );
  const planeIntersects = scene.getIntersectObjects( objects );
  const intersects = blockIntersects.concat(planeIntersects);
  ;
  if ( intersects.length > 0 ) {
    const intersect = intersects[ 0 ];
    // delete cube
    if ( isShiftDown ) {
      if ( intersect.object != scene.plane.plane ) {
        scene.remove( intersect.object );
        userCreated.setDead(gridX, gridY);
        lifeTracker.setDead(gridX, gridY);
      }
    // create cube
    } else {
      // debugger
      lifeTracker.setAlive(gridX, gridY);
      userCreated.setAlive(gridX, gridY);
      objects.push( scene.createBox() );
    }
    scene.render();
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


});
