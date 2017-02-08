/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _grid = __webpack_require__(1);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	var _plane = __webpack_require__(2);
	
	var _plane2 = _interopRequireDefault(_plane);
	
	var _patterns = __webpack_require__(3);
	
	var Patterns = _interopRequireWildcard(_patterns);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// TODO: compare lifetrackers to see if something has run to completion
	
	var camera = void 0,
	    controls = void 0,
	    scene = void 0,
	    renderer = void 0,
	    width = void 0,
	    height = void 0,
	    grid = void 0,
	    plane = void 0;
	width = window.innerWidth;
	height = window.innerHeight;
	scene = new THREE.Scene();
	
	var raycaster = new THREE.Raycaster();
	var isShiftDown = false;
	var mouse = new THREE.Vector2();
	var tick = 5;
	var rows = 100,
	    cols = 100;
	var objects = [];
	var preloaded = [];
	var lifeTracker = {};
	var userCreated = {};
	
	var rollOverGeo = new THREE.BoxBufferGeometry(10, 10, 10);
	var rollOverMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff", opacity: 0.5, transparent: true });
	var rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
	var normalMaterial = new THREE.MeshNormalMaterial({
	  opacity: 1,
	  transparent: false
	});
	
	window.start = function () {
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
	};
	
	var started = false;
	
	window.animate = function () {
	  controls.update();
	
	  requestAnimationFrame(animate);
	  if (started) {
	    step();
	  }
	};
	
	function step() {
	  if (tick % 5 === 0) {
	    grid.step(tick / 5);
	    camera.position.set(camera.position.x, camera.position.y + 2, camera.position.z + 7);
	    scene.add(grid.grid);
	  }
	  tick += 5;
	}
	
	function animateStartButton() {
	  var startButton = document.getElementById("start_button");
	  startButton.addEventListener('click', function () {
	    var val = started ? "Start!" : "Pause!";
	    startButton.classList.toggle("green");
	    startButton.classList.toggle("red");
	    startButton.innerHTML = val;
	    started = !started;
	    scene.remove(rollOverMesh);
	    removeButtons();
	    grid = new _grid2.default(rows, cols, grid.lifeTracker);
	    animate();
	  });
	}
	
	function render() {
	  renderer.render(scene, camera);
	}
	
	function addEssentialEvents() {
	  document.addEventListener("mousemove", onDocumentMouseMove, false);
	  document.addEventListener('mousedown', onDocumentMouseDown, false);
	  document.addEventListener('keydown', onDocumentKeyDown, false);
	  document.addEventListener('keyup', onDocumentKeyUp, false);
	  window.addEventListener('resize', onWindowResize, false);
	}
	
	function addGliderGunButton() {
	  var gliderGunButton = document.getElementById("glider_gun");
	  gliderGunButton.addEventListener('click', createGliderGun);
	}
	
	function removeButtons() {
	  var gliderGunButton = document.getElementById("glider_gun");
	  var crossButton = document.getElementById("cross");
	  var randomButton = document.getElementById("random");
	  var gardenButton = document.getElementById("garden");
	  gliderGunButton.removeEventListener('click', createGliderGun);
	  crossButton.removeEventListener('click', createCross);
	  gardenButton.removeEventListener('click', createGarden);
	  randomButton.removeEventListener('click', createRandom);
	  document.removeEventListener("mousemove", onDocumentMouseMove, false);
	  document.removeEventListener('mousedown', onDocumentMouseDown, false);
	  document.removeEventListener('keydown', onDocumentKeyDown, false);
	  document.removeEventListener('keyup', onDocumentKeyUp, false);
	}
	
	function createGliderGun() {
	  makeGrid(function (x, y, coord) {
	    initPattern(x, y, coord, Patterns.shiftPattern(Patterns.GLIDER_GUN, 20, 30));
	  });
	  addBlocks();
	}
	
	function addCrossButton() {
	  var crossButton = document.getElementById("cross");
	  crossButton.addEventListener('click', createCross);
	}
	
	function createCross() {
	  makeGrid(function (x, y, coord) {
	    initPattern(x, y, coord, Patterns.createCross(100));
	  });
	  addBlocks();
	}
	
	function addRandomButton() {
	  var randomButton = document.getElementById("random");
	  randomButton.addEventListener('click', createRandom);
	}
	
	function createRandom() {
	  makeGrid(initRandom);
	  addBlocks();
	}
	
	function addGardenButton() {
	  var gardenButton = document.getElementById("garden");
	  gardenButton.addEventListener('click', createGarden);
	}
	
	function createGarden() {
	  makeGrid(function (x, y, coord) {
	    initPattern(x, y, coord, Patterns.shiftPattern(Patterns.GARDEN_EDEN, 20, 30));
	  });
	  addBlocks();
	}
	
	function initPattern(x, y, coord, pattern) {
	  if (isPatternBlock(x, y, pattern)) {
	    lifeTracker[coord] = true;
	  } else {
	    if (!userCreated.hasOwnProperty(coord)) {
	      lifeTracker[coord] = false;
	    }
	  }
	}
	
	function initRandom(x, y, coord) {
	  var lifeNum = Math.floor(Math.random() * 100);
	  if (lifeNum <= 15) {
	    lifeTracker[coord] = true;
	  } else {
	    if (!userCreated.hasOwnProperty(coord)) {
	      lifeTracker[coord] = false;
	    }
	  }
	}
	
	function isPatternBlock(x, y, pattern) {
	  if (pattern.hasOwnProperty(x)) {
	    if (pattern[x].indexOf(y) > -1) return true;
	  }
	  return false;
	}
	
	function createScene() {
	  var light = new THREE.AmbientLight(0xffffff, 1);
	  scene.add(light);
	  // scene.fog = new THREE.Fog( "#bdbdbd", 1, 1200 );
	  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
	  camera.position.set(0, -1000, 700);
	  camera.lookAt(new THREE.Vector3(0, 0, 0));
	}
	
	function createControls() {
	  controls = new THREE.TrackballControls(camera);
	  controls.addEventListener("change", render);
	}
	
	function createRenderer() {
	  renderer = new THREE.WebGLRenderer();
	  renderer.setClearColor("#bdbdbd", 1);
	  renderer.setPixelRatio(window.devicePixelRatio);
	  renderer.setSize(width, height);
	  document.body.append(renderer.domElement);
	}
	
	function createRollOver() {
	  scene.add(rollOverMesh);
	}
	
	function addBlocks() {
	  grid = new _grid2.default(rows, cols, lifeTracker);
	  preloaded = preloaded.concat(grid.grid);
	  objects = objects.concat(grid.grid);
	  for (var i = 0; i < grid.grid.length; i++) {
	    scene.add(grid.grid[i]);
	  }
	}
	
	function addPlane() {
	  plane = new _plane2.default(rows, cols);
	  objects.push(plane.plane);
	  scene.add(plane.plane);
	  scene.add(plane.grid);
	}
	
	function createLifeTracker() {
	  for (var x = 0; x < rows; x++) {
	    for (var y = 0; y < cols; y++) {
	      lifeTracker[x + ',' + y] = false;
	    }
	  }
	}
	
	function interateLifeTracker(callback) {
	  Object.keys(lifeTracker).forEach(function (coord) {
	    var coordArray = coord.split(",");
	    var x = parseInt(coordArray[0]);
	    var y = parseInt(coordArray[1]);
	
	    callback(x, y, coord);
	  });
	}
	
	function makeGrid(initCallback) {
	  preloaded.forEach(function (cell) {
	    scene.remove(cell);
	  });
	  preloaded = [];
	  interateLifeTracker(function (x, y, coord) {
	    initCallback(x, y, coord);
	  });
	}
	
	function createBox(x, y) {
	  var gridY = (y - 5 + 500) / 10,
	      gridX = (x - 5 + 500) / 10,
	      box = new THREE.Mesh(rollOverGeo, normalMaterial);
	  box.position.set(x, y, 5);
	
	  return box;
	}
	
	function onDocumentMouseMove(event) {
	  event.preventDefault();
	  mouse.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
	  raycaster.setFromCamera(mouse, camera);
	  var intersects = raycaster.intersectObjects(objects);
	  if (intersects.length > 0) {
	    var intersect = intersects[0];
	    rollOverMesh.position.copy(intersect.point);
	    rollOverMesh.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
	    rollOverMesh.position.z = 5;
	    if (rollOverMesh.position.x < -500) rollOverMesh.position.x = -500;
	    if (rollOverMesh.position.y < -500) rollOverMesh.position.y = -500;
	  }
	  render();
	}
	
	function onDocumentMouseDown(event) {
	  event.preventDefault();
	  var gridX = (rollOverMesh.position.x - 5 + 500) / 10;
	  var gridY = (rollOverMesh.position.y - 5 + 500) / 10;
	  mouse.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
	  raycaster.setFromCamera(mouse, camera);
	  var intersects = raycaster.intersectObjects(objects);
	  if (intersects.length > 0) {
	    var intersect = intersects[0];
	    // delete cube
	    if (isShiftDown) {
	      if (intersect.object != plane.plane) {
	        scene.remove(intersect.object);
	        objects.splice(objects.indexOf(intersect.object), 1);
	        delete userCreated[gridX + ',' + gridY];
	        lifeTracker[gridX + ',' + gridY] = false;
	      }
	      // create cube
	    } else {
	      var cell = createBox(rollOverMesh.position.x, rollOverMesh.position.y);
	      lifeTracker[gridX + ',' + gridY] = true;
	      userCreated[gridX + ',' + gridY] = true;
	      scene.add(cell);
	      objects.push(cell);
	    }
	    render();
	  }
	}
	
	function onDocumentKeyDown(event) {
	  switch (event.keyCode) {
	    case 16:
	      isShiftDown = true;
	      break;
	  }
	}
	
	function onDocumentKeyUp(event) {
	  switch (event.keyCode) {
	    case 16:
	      isShiftDown = false;
	      break;
	  }
	}
	
	function onWindowResize() {
	  camera.aspect = window.innerWidth / window.innerHeight;
	  camera.updateProjectionMatrix();
	  renderer.setSize(window.innerWidth, window.innerHeight);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Grid = function () {
	  function Grid(rows, cols, lifeTracker) {
	    _classCallCheck(this, Grid);
	
	    //constants and multiplier
	    this.worldWidth = rows * 10;
	    this.worldHeight = cols * 10;
	    this.rows = rows;
	    this.cols = cols;
	    this.multiplier = 1;
	    //data storage
	    this.grid;
	    this.lifeTracker = lifeTracker;
	    this.basicCell = new THREE.BoxBufferGeometry(10, 10, 10);
	    this.normalMaterial = new THREE.MeshNormalMaterial({
	      opacity: 1,
	      transparent: true
	    });
	
	    //initialize data storage
	    this.makeGrid();
	  }
	
	  _createClass(Grid, [{
	    key: "createBox",
	    value: function createBox(x, y) {
	      var xBase = -this.worldWidth / 2 + x * 10 + 10 / 2,
	          yBase = -this.worldHeight / 2 + y * 10 + 10 / 2,
	          zBase = this.multiplier * (10 / 2),
	          box = new THREE.BoxGeometry(10, 10, 10);
	      box.applyMatrix(new THREE.Matrix4().makeTranslation(xBase, yBase, zBase));
	      return box;
	    }
	  }, {
	    key: "makeGrid",
	    value: function makeGrid() {
	      var _this = this;
	
	      var grid = [];
	      this.interateLifeTracker(function (x, y, coord) {
	        if (_this.lifeTracker[coord]) {
	          grid.push(new THREE.Mesh(_this.createBox(x, y), _this.normalMaterial));
	        }
	      });
	      this.grid = grid;
	    }
	  }, {
	    key: "interateLifeTracker",
	    value: function interateLifeTracker(callback) {
	      Object.keys(this.lifeTracker).forEach(function (coord) {
	        var coordArray = coord.split(",");
	        var x = parseInt(coordArray[0]);
	        var y = parseInt(coordArray[1]);
	
	        callback(x, y, coord);
	      });
	    }
	  }, {
	    key: "step",
	    value: function step(multiplier) {
	      var _this2 = this;
	
	      this.multiplier = multiplier;
	
	      var newTracker = {};
	      var newGrid = new THREE.BoxGeometry(0, 0, 0);
	      this.interateLifeTracker(function (x, y, coord) {
	        _this2.populationLogic(x, y, coord, newTracker, newGrid);
	      });
	
	      var newGridBuffer = new THREE.BufferGeometry().fromGeometry(newGrid);
	      this.grid = new THREE.Mesh(newGridBuffer, this.normalMaterial);
	
	      this.lifeTracker = newTracker;
	    }
	  }, {
	    key: "populationLogic",
	    value: function populationLogic(x, y, coord, newTracker, newGrid) {
	      var aliveNeighbors = this.countNeighbors(x, y);
	      var thisCell = this.lifeTracker[coord];
	
	      if (thisCell) {
	        if (aliveNeighbors < 2) {
	          newTracker[coord] = false;
	        } else if (aliveNeighbors <= 3) {
	          newTracker[coord] = true;
	          newGrid.merge(this.createBox(x, y));
	        } else if (aliveNeighbors > 3) {
	          newTracker[coord] = false;
	        }
	      } else {
	        if (aliveNeighbors < 3) {
	          newTracker[coord] = false;
	        } else if (aliveNeighbors === 3) {
	          newTracker[coord] = true;
	          newGrid.merge(this.createBox(x, y));
	        } else {
	          newTracker[coord] = false;
	        }
	      }
	    }
	  }, {
	    key: "countNeighbors",
	    value: function countNeighbors(y, x) {
	      var row_above = y - 1 >= 0 ? y - 1 : this.cols - 1,
	          row_below = y + 1 <= this.cols - 1 ? y + 1 : 0,
	          column_left = x - 1 >= 0 ? x - 1 : this.rows - 1,
	          column_right = x + 1 <= this.rows - 1 ? x + 1 : 0;
	
	      var neighbors = {
	        top_left: this.lifeTracker[row_above + "," + column_left],
	        top_center: this.lifeTracker[row_above + "," + x],
	        top_right: this.lifeTracker[row_above + "," + column_right],
	        left: this.lifeTracker[y + "," + column_left],
	        right: this.lifeTracker[y + "," + column_right],
	        bottom_left: this.lifeTracker[row_below + "," + column_left],
	        bottom_center: this.lifeTracker[row_below + "," + x],
	        bottom_right: this.lifeTracker[row_below + "," + column_right]
	      };
	
	      var aliveCount = 0;
	      for (var neighbor in neighbors) {
	        if (neighbors[neighbor]) aliveCount++;
	      }
	
	      return aliveCount;
	    }
	  }]);
	
	  return Grid;
	}();
	
	exports.default = Grid;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Plane = function () {
	  function Plane(rows, cols) {
	    _classCallCheck(this, Plane);
	
	    this.rows = rows;
	    this.cols = cols;
	
	    this.plane = this.initPlane();
	    this.grid = this.initGrid();
	  }
	
	  _createClass(Plane, [{
	    key: "initPlane",
	    value: function initPlane() {
	      var geometry = new THREE.PlaneBufferGeometry(this.rows * 10, this.cols * 10);
	      return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false, color: "#000000" }));
	    }
	  }, {
	    key: "initGrid",
	    value: function initGrid() {
	      var size = 500;
	      var step = 10;
	      var geometry = new THREE.Geometry();
	      for (var i = -size; i <= size + 1; i += step) {
	        geometry.vertices.push(new THREE.Vector3(-size, i, 0));
	        geometry.vertices.push(new THREE.Vector3(size, i, 0));
	        geometry.vertices.push(new THREE.Vector3(i, -size, 0));
	        geometry.vertices.push(new THREE.Vector3(i, size, 0));
	      }
	      var material = new THREE.LineBasicMaterial({ color: "#dddddd" });
	      return new THREE.LineSegments(geometry, material);
	    }
	  }]);
	
	  return Plane;
	}();
	
	exports.default = Plane;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.shiftPattern = shiftPattern;
	exports.createCross = createCross;
	exports.createRandom = createRandom;
	var GLIDER_GUN = exports.GLIDER_GUN = {
	  1: [5, 6],
	  2: [5, 6],
	  11: [5, 6, 7],
	  12: [4, 8],
	  13: [3, 9],
	  14: [3, 9],
	  15: [6],
	  16: [4, 8],
	  17: [5, 6, 7],
	  18: [6],
	  21: [3, 4, 5],
	  22: [3, 4, 5],
	  23: [2, 6],
	  25: [1, 2, 6, 7],
	  35: [3, 4],
	  36: [3, 4]
	};
	
	var GARDEN_EDEN = exports.GARDEN_EDEN = {
	  6: [17, 18, 19, 20, 21, 22, 24, 25],
	  7: [17, 18, 20, 22, 23, 24, 25],
	  8: [17, 19, 20, 21, 22, 23, 25],
	  9: [17, 18, 20, 22, 24, 25],
	  10: [17, 19, 20, 21, 23, 24, 25],
	  11: [17, 18, 19, 21, 22, 23, 25],
	  12: [17, 18, 19, 20, 22, 23, 24, 25],
	  13: [17, 18, 20, 21, 22, 24, 25],
	  14: [17, 19, 20, 21, 23, 24, 25],
	  15: [17, 18, 19, 21, 22, 23, 25],
	  16: [17, 18, 19, 20, 22, 23, 24, 25],
	  17: [17, 18, 20, 21, 22, 24, 25],
	  18: [17, 19, 20, 21, 23, 24, 25],
	  19: [17, 18, 19, 21, 22, 23, 25],
	  20: [17, 18, 19, 20, 22, 23, 24, 25],
	  21: [17, 19, 20, 21, 22, 24, 25],
	  22: [17, 18, 20, 22, 23, 25],
	  23: [17, 19, 20, 21, 22, 24, 25],
	  24: [17, 18, 19, 21, 23, 24],
	  25: [17, 19, 20, 21, 22, 24, 25],
	  26: [17, 18, 20, 22, 23, 24, 25],
	  27: [17, 19, 20, 21, 23, 25],
	  28: [17, 18, 20, 22, 23, 24, 25],
	  29: [17, 19, 20, 21, 23, 25],
	  30: [17, 18, 20, 22, 23, 24, 25],
	  31: [17, 19, 20, 21, 23, 25],
	  32: [17, 18, 20, 22, 23, 24, 25],
	  33: [17, 19, 20, 21, 23, 25],
	  34: [17, 18, 20, 22, 23, 24, 25],
	  35: [17, 19, 20, 21, 23, 25],
	  36: [17, 18, 20, 22, 23, 24, 25],
	  37: [17, 19, 20, 21, 23, 25],
	  38: [17, 18, 20, 22, 23, 24, 25]
	};
	
	function shiftPattern(pattern, shiftX, shiftY) {
	  var newPattern = {};
	
	  var _loop = function _loop(_x) {
	    _x = parseInt(_x);
	    newPattern[_x + shiftX] = [];
	    pattern[_x].forEach(function (y) {
	      newPattern[_x + shiftX].push(y + shiftY);
	    });
	    x = _x;
	  };
	
	  for (var x in pattern) {
	    _loop(x);
	  }
	  return newPattern;
	}
	
	function createCross(size) {
	  if (size % 2 !== 0) {
	    size -= 1;
	  }
	  var leftBound = (size - 6) / 2;
	  var innerleft = leftBound + 2;
	
	  var rightBound = (size - 6) / 2 + 6;
	  var innerRight = rightBound - 3;
	
	  var crossCoords = {};
	  for (var _x2 = 0; _x2 < size; _x2++) {
	    if (_x2 < leftBound || _x2 >= rightBound) {
	      crossCoords[_x2] = [_x2, size - _x2 - 1];
	    } else {
	      if (_x2 < innerleft || _x2 > innerRight) {
	        crossCoords[_x2] = [leftBound, leftBound + 1, leftBound + 2, leftBound + 3, leftBound + 4, leftBound + 5];
	      } else {
	        crossCoords[_x2] = [leftBound, leftBound + 1, leftBound + 4, leftBound + 5];
	      }
	    }
	  }
	  return crossCoords;
	}
	
	function createRandom() {
	  var determinate = Math.floor(Math.random() * 100);
	  if (determinate <= 10) return true;
	  return false;
	}
	
	// const welcome = [
	//   {gridX: 4, gridY: 4},
	//   {gridX: 4, gridY: 3},
	//   {gridX: 4, gridY: 2},
	//   {gridX: 4, gridY: 1},
	//   {gridX: 4, gridY: 0},
	//   {gridX: 5, gridY: 1},
	//   {gridX: 6, gridY: 2},
	//   {gridX: 7, gridY: 1},
	//   {gridX: 8, gridY: 0},
	//   {gridX: 8, gridY: 1},
	//   {gridX: 8, gridY: 2},
	//   {gridX: 8, gridY: 3},
	//   {gridX: 8, gridY: 4},
	//   {gridX: 10, gridY: 4},
	//   {gridX: 10, gridY: 3},
	//   {gridX: 10, gridY: 2},
	//   {gridX: 10, gridY: 1},
	//   {gridX: 10, gridY: 0},
	//   {gridX: 11, gridY: 0},
	//   {gridX: 12, gridY: 0},
	//   {gridX: 11, gridY: 2},
	//   {gridX: 11, gridY: 4},
	//   {gridX: 12, gridY: 4},
	//   {gridX: 14, gridY: 4},
	//   {gridX: 14, gridY: 3},
	//   {gridX: 14, gridY: 2},
	//   {gridX: 14, gridY: 1},
	//   {gridX: 14, gridY: 0},
	//   {gridX: 15, gridY: 0},
	//   {gridX: 16, gridY: 0},
	//   {gridX: 18, gridY: 0},
	//   {gridX: 19, gridY: 0},
	//   {gridX: 20, gridY: 0},
	//   {gridX: 18, gridY: 1},
	//   {gridX: 18, gridY: 2},
	//   {gridX: 18, gridY: 3},
	//   {gridX: 18, gridY: 4},
	//   {gridX: 19, gridY: 4},
	//   {gridX: 20, gridY: 4},
	//   {gridX: 22, gridY: 3},
	//   {gridX: 22, gridY: 4},
	//   {gridX: 22, gridY: 2},
	//   {gridX: 22, gridY: 1},
	//   {gridX: 22, gridY: 0},
	//   {gridX: 23, gridY: 0},
	//   {gridX: 24, gridY: 0},
	//   {gridX: 24, gridY: 1},
	//   {gridX: 24, gridY: 2},
	//   {gridX: 24, gridY: 3},
	//   {gridX: 24, gridY: 4},
	//   {gridX: 23, gridY: 4},
	//   {gridX: 26, gridY: 4},
	//   {gridX: 26, gridY: 2},
	//   {gridX: 26, gridY: 2},
	//   {gridX: 26, gridY: 3},
	//   {gridX: 26, gridY: 1},
	//   {gridX: 26, gridY: 0},
	//   {gridX: 27, gridY: 3},
	//   {gridX: 28, gridY: 2},
	//   {gridX: 29, gridY: 3},
	//   {gridX: 30, gridY: 4},
	//   {gridX: 30, gridY: 3},
	//   {gridX: 30, gridY: 2},
	//   {gridX: 30, gridY: 1},
	//   {gridX: 30, gridY: 0},
	//   {gridX: 32, gridY: 4},
	//   {gridX: 32, gridY: 3},
	//   {gridX: 32, gridY: 2},
	//   {gridX: 32, gridY: 1},
	//   {gridX: 32, gridY: 0},
	//   {gridX: 33, gridY: 0},
	//   {gridX: 34, gridY: 0},
	//   {gridX: 33, gridY: 2},
	//   {gridX: 33, gridY: 4},
	//   {gridX: 34, gridY: 4},
	// ]

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map