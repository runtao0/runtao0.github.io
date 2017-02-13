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
	
	var _scene = __webpack_require__(3);
	
	var _scene2 = _interopRequireDefault(_scene);
	
	var _life_tracker = __webpack_require__(2);
	
	var _life_tracker2 = _interopRequireDefault(_life_tracker);
	
	var _plane = __webpack_require__(4);
	
	var _plane2 = _interopRequireDefault(_plane);
	
	var _patterns = __webpack_require__(5);
	
	var Patterns = _interopRequireWildcard(_patterns);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// TODO: compare lifetrackers to see if something has run to completion
	
	$(function () {
	  var scene = new _scene2.default(window.innerWidth, window.innerHeight);
	  var firstTime = true;
	  var isShiftDown = false;
	  var started = false;
	  var tick = 5;
	  var rows = 100,
	      cols = 100;
	  var objects = [];
	  var preloaded = [];
	  var lifeTracker = scene.grid.lifeTracker;
	  var userCreated = new _life_tracker2.default();
	
	  setUpSceneAll();
	
	  var $buttons = $(".buttons");
	  $(document).on("mousemove", onDocumentMouseMove).on("mousedown", onDocumentMouseDown).on("keydown", onDocumentKeyDown).on("keyup", onDocumentKeyUp);
	  window.addEventListener('resize', scene.onWindowResize.bind(scene), false);
	
	  $buttons.on("click", "button", function (event) {
	    event.preventDefault();
	    switch (event.target.id) {
	      case 'start_button':
	        if (firstTime) {
	          if (lifeTracker.countLife()) {
	            onStart(event.target);
	          } else {
	            var error = $("<h2>Add more blocks for life to happen!</h2>");
	            error.addClass("error");
	            $("body").append(error);
	          }
	        } else {
	          var val = started ? "Start!" : "Pause!";
	          event.target.classList.toggle("green");
	          event.target.classList.toggle("red");
	          event.target.innerHTML = val;
	          started = !started;
	        }
	        break;
	      case 'glider_gun':
	        createPattern(Patterns.shiftPattern(Patterns.GLIDER_GUN, 20, 30));
	        break;
	      case 'cross':
	        createPattern(Patterns.createCross(100));
	        break;
	      case 'benchmark':
	        createPattern(Patterns.createBenchmark(50, 100));
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
	    requestAnimationFrame(animate);
	    if (started) {
	      step();
	    }
	  }
	
	  function step() {
	    if (tick % 5 === 0) {
	      scene.grid.step(tick / 5);
	      scene.cameraFollowGrowth();
	      scene.addGeneration();
	      tick += 5;
	    }
	  }
	
	  function onStart(element) {
	    removeEvents();
	    setTimeout(function () {
	      $("header").animate({ left: "-100%" }, { duration: 2000 });
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
	    $("#sidebar").on("mouseenter", function () {
	      $("header").animate({ left: 0 }, { duration: 1000 });
	    }).on("mouseleave", function () {
	      $("header").animate({ left: "-100%" }, { duration: 1000 });
	    });
	  }
	
	  function setUpSceneAll() {
	    scene.createRenderer();
	    scene.addPlane(objects);
	    scene.createRollOver();
	    scene.setPositions();
	    scene.addAllToScene();
	    scene.renderControls();
	  }
	
	  function translatePatternToLifeTracker(pattern) {
	    lifeTracker.iterate(function (x, y, coord) {
	      if (userCreated.hasOwnProperty(coord)) {
	        lifeTracker.setAlive(x, y);
	      } else {
	        if (isSquareAlive(x, y, pattern)) {
	          lifeTracker.setAlive(x, y);
	        } else {
	          lifeTracker.setDead(x, y);
	        }
	      }
	    });
	  }
	
	  function isSquareAlive(x, y, pattern) {
	    if (pattern.hasOwnProperty(x)) {
	      if (pattern[x].indexOf(y) > -1) return true;
	    }
	    return false;
	  }
	
	  function createPattern(pattern) {
	    scene.clearPrevious();
	    translatePatternToLifeTracker(pattern);
	    scene.makeGrid();
	    scene.addBlocks(preloaded, objects);
	  }
	
	  function createRandom() {
	    scene.clearPrevious();
	    lifeTracker.random();
	    scene.makeGrid();
	    scene.addBlocks(preloaded, objects);
	  }
	
	  function onDocumentMouseMove(event) {
	    event.preventDefault();
	    scene.mouse.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
	    scene.raycaster.setFromCamera(scene.mouse, scene.camera);
	    var intersects = scene.raycaster.intersectObjects(objects);
	    if (intersects.length > 0) {
	      var intersect = intersects[0];
	      scene.rollOverMesh.position.copy(intersect.point);
	      scene.rollOverMesh.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
	      scene.rollOverMesh.position.z = 5;
	      if (scene.rollOverMesh.position.x < -500) scene.rollOverMesh.position.x = -500;
	      if (scene.rollOverMesh.position.y < -500) scene.rollOverMesh.position.y = -500;
	    }
	    scene.render();
	  }
	
	  function onDocumentMouseDown(event) {
	    event.preventDefault();
	    var gridX = scene.rollOverXPos();
	    var gridY = scene.rollOverYPos();
	    scene.mouse.set(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
	    scene.raycaster.setFromCamera(scene.mouse, scene.camera);
	    var intersects = scene.raycaster.intersectObjects(scene.grid.cells);
	    if (intersects.length > 0) {
	      var intersect = intersects[0];
	      // delete cube
	      if (isShiftDown) {
	        if (intersect.object != scene.plane.plane) {
	          scene.scene.remove(intersect.object);
	          objects.splice(objects.indexOf(intersect.object), 1);
	          userCreated.setDead(gridX, gridY);
	          lifeTracker.setDead(gridX, gridY);
	        }
	        // create cube
	      } else {
	        ;
	        lifeTracker.setAlive(gridX, gridY);
	        userCreated.setAlive(gridX, gridY);
	        objects.push(scene.createBox());
	      }
	      scene.render();
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
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _life_tracker = __webpack_require__(2);
	
	var _life_tracker2 = _interopRequireDefault(_life_tracker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Grid = function () {
	  function Grid() {
	    var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
	    var cols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
	    var lifeTracker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _life_tracker2.default();
	
	    _classCallCheck(this, Grid);
	
	    //constants and multiplier
	    this.worldWidth = rows * 10;
	    this.worldHeight = cols * 10;
	    this.rows = rows;
	    this.cols = cols;
	    this.multiplier = 1;
	    //data storage
	    this.cells = [];
	    this.lifeTracker = lifeTracker;
	    this.basicCell = new THREE.BoxBufferGeometry(10, 10, 10);
	    this.normalMaterial = new THREE.MeshNormalMaterial({
	      opacity: 1,
	      transparent: true
	    });
	
	    this.createBox = this.createBox.bind(this);
	  }
	
	  _createClass(Grid, [{
	    key: 'createBox',
	    value: function createBox(x, y) {
	      var xBase = -this.worldWidth / 2 + x * 10 + 10 / 2,
	          yBase = -this.worldHeight / 2 + y * 10 + 10 / 2,
	          zBase = this.multiplier * (10 / 2),
	          box = new THREE.BoxGeometry(10, 10, 10);
	      box.applyMatrix(new THREE.Matrix4().makeTranslation(xBase, yBase, zBase));
	      return box;
	    }
	  }, {
	    key: 'makeGrid',
	    value: function makeGrid() {
	      var _this = this;
	
	      var grid = [];
	      this.lifeTracker.iterate(function (x, y, coord) {
	        if (_this.lifeTracker.isAlive(coord)) {
	          grid.push(new THREE.Mesh(_this.createBox(x, y), _this.normalMaterial));
	        }
	      });
	      this.cells = grid;
	    }
	  }, {
	    key: 'step',
	    value: function step(multiplier) {
	      var _this2 = this;
	
	      this.multiplier = multiplier;
	
	      var newTracker = {};
	      var newGrid = new THREE.BoxGeometry(0, 0, 0);
	
	      this.lifeTracker.nextStep(function (x, y) {
	        newGrid.merge(_this2.createBox(x, y));
	      });
	
	      var newGridBuffer = new THREE.BufferGeometry().fromGeometry(newGrid);
	      this.cells = new THREE.Mesh(newGridBuffer, this.normalMaterial);
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
	
	var LifeTracker = function () {
	  function LifeTracker() {
	    var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
	    var cols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
	
	    _classCallCheck(this, LifeTracker);
	
	    this.rows = rows;
	    this.cols = cols;
	    this.tracker = this.create();
	  }
	
	  _createClass(LifeTracker, [{
	    key: "create",
	    value: function create() {
	      var tracker = {};
	      for (var x = 0; x < this.rows; x++) {
	        for (var y = 0; y < this.cols; y++) {
	          tracker[x + "," + y] = false;
	        }
	      }
	      return tracker;
	    }
	  }, {
	    key: "isAlive",
	    value: function isAlive(coord) {
	      return this.tracker[coord];
	    }
	  }, {
	    key: "setDead",
	    value: function setDead(x, y) {
	      this.tracker[x + "," + y] = false;
	    }
	  }, {
	    key: "setAlive",
	    value: function setAlive(x, y) {
	      this.tracker[x + "," + y] = true;
	    }
	  }, {
	    key: "countLife",
	    value: function countLife() {
	      var count = 0;
	      for (var x in this.tracker) {
	        if (this.tracker[x]) count++;
	      }
	      return count > 10;
	    }
	  }, {
	    key: "random",
	    value: function random() {
	      var _this = this;
	
	      this.iterate(function (x, y) {
	        var lifeNum = Math.floor(Math.random() * 100);
	        if (lifeNum <= 12) {
	          _this.setAlive(x, y);
	        } else {
	          _this.setDead(x, y);
	        }
	      });
	    }
	  }, {
	    key: "nextStep",
	    value: function nextStep(callback) {
	      var _this2 = this;
	
	      var newTracker = {};
	      this.iterate(function (x, y, coord) {
	        _this2._populationLogic(x, y, coord, newTracker, callback);
	      });
	      this.tracker = newTracker;
	    }
	  }, {
	    key: "iterate",
	    value: function iterate(callback) {
	      // debugger
	      Object.keys(this.tracker).forEach(function (coord) {
	        var coordArray = coord.split(",");
	        var x = parseInt(coordArray[0]);
	        var y = parseInt(coordArray[1]);
	
	        callback(x, y, coord);
	      });
	    }
	  }, {
	    key: "translatePattern",
	    value: function translatePattern(pattern) {
	
	      for (var x in pattern) {
	        for (var y = 0; y < pattern.x.length; y++) {
	          newTracker[x + "," + pattern.x[y]] = true;
	        }
	      }
	    }
	  }, {
	    key: "_populationLogic",
	    value: function _populationLogic(x, y, coord, newTracker, callback) {
	
	      var aliveNeighbors = this._countNeighbors(x, y);
	      var thisCell = this.tracker[coord];
	
	      if (thisCell) {
	        if (aliveNeighbors < 2) {
	          newTracker[coord] = false;
	        } else if (aliveNeighbors <= 3) {
	          newTracker[coord] = true;
	          callback(x, y);
	        } else if (aliveNeighbors > 3) {
	          newTracker[coord] = false;
	        }
	      } else {
	        if (aliveNeighbors < 3) {
	          newTracker[coord] = false;
	        } else if (aliveNeighbors === 3) {
	          newTracker[coord] = true;
	          callback(x, y);
	        } else {
	          newTracker[coord] = false;
	        }
	      }
	    }
	  }, {
	    key: "_countNeighbors",
	    value: function _countNeighbors(y, x) {
	      var row_above = y - 1 >= 0 ? y - 1 : this.cols - 1,
	          row_below = y + 1 <= this.cols - 1 ? y + 1 : 0,
	          column_left = x - 1 >= 0 ? x - 1 : this.rows - 1,
	          column_right = x + 1 <= this.rows - 1 ? x + 1 : 0;
	
	      var neighbors = {
	        top_left: this.tracker[row_above + "," + column_left],
	        top_center: this.tracker[row_above + "," + x],
	        top_right: this.tracker[row_above + "," + column_right],
	        left: this.tracker[y + "," + column_left],
	        right: this.tracker[y + "," + column_right],
	        bottom_left: this.tracker[row_below + "," + column_left],
	        bottom_center: this.tracker[row_below + "," + x],
	        bottom_right: this.tracker[row_below + "," + column_right]
	      };
	
	      var aliveCount = 0;
	      for (var neighbor in neighbors) {
	        if (neighbors[neighbor]) aliveCount++;
	      }
	
	      return aliveCount;
	    }
	  }]);
	
	  return LifeTracker;
	}();
	
	exports.default = LifeTracker;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _plane = __webpack_require__(4);
	
	var _plane2 = _interopRequireDefault(_plane);
	
	var _grid = __webpack_require__(1);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	var _life_tracker = __webpack_require__(2);
	
	var _life_tracker2 = _interopRequireDefault(_life_tracker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Scene = function () {
	  function Scene(width, height) {
	    var lifeTracker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _life_tracker2.default();
	
	    _classCallCheck(this, Scene);
	
	    this.width = width;
	    this.height = height;
	    this.scene = new THREE.Scene();
	    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
	    this.scene = new THREE.Scene();
	    this.light = new THREE.AmbientLight(0xffffff, 1);
	    this.renderer = new THREE.WebGLRenderer();
	    this.mouse = new THREE.Vector2();
	    this.raycaster = new THREE.Raycaster();
	    this.plane = new _plane2.default(100, 100);
	    this.controls = new THREE.TrackballControls(this.camera);
	    this.grid = new _grid2.default(100, 100, lifeTracker);
	    this.rollOverGeo = this.grid.basicCell;
	    this.rollOverMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff", opacity: 0.5, transparent: true });
	    this.rollOverMesh = new THREE.Mesh(this.rollOverGeo, this.rollOverMaterial);
	    this.normalMaterial = this.grid.normalMaterial;
	  }
	
	  _createClass(Scene, [{
	    key: 'addGeneration',
	    value: function addGeneration() {
	      this.scene.add(this.grid.cells);
	    }
	  }, {
	    key: 'makeGrid',
	    value: function makeGrid() {
	      this.grid.makeGrid();
	    }
	  }, {
	    key: 'renderControls',
	    value: function renderControls() {
	      this.controls.addEventListener("change", this.render.bind(this));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.renderer.render(this.scene, this.camera);
	    }
	  }, {
	    key: 'cameraFollowGrowth',
	    value: function cameraFollowGrowth() {
	      this.camera.position.set(this.camera.position.x, this.camera.position.y + 2, this.camera.position.z + 7);
	    }
	  }, {
	    key: 'setPositions',
	    value: function setPositions() {
	      this.camera.position.set(0, -1000, 700);
	      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
	    }
	  }, {
	    key: 'addAllToScene',
	    value: function addAllToScene() {
	      this.scene.add(this.light);
	    }
	  }, {
	    key: 'createRenderer',
	    value: function createRenderer() {
	      this.renderer.setClearColor("#9c9999", 1);
	      this.renderer.setPixelRatio(window.devicePixelRatio);
	      this.renderer.setSize(this.width, this.height);
	      document.body.append(this.renderer.domElement);
	    }
	  }, {
	    key: 'addBlocks',
	    value: function addBlocks(preloaded, objects) {
	      preloaded = preloaded.concat(this.grid.cells);
	      objects = objects.concat(this.grid.cells);
	      for (var i = 0; i < this.grid.cells.length; i++) {
	        this.scene.add(this.grid.cells[i]);
	      }
	    }
	  }, {
	    key: 'addPlane',
	    value: function addPlane(objects) {
	      objects.push(this.plane.plane);
	      this.scene.add(this.plane.plane);
	      this.scene.add(this.plane.grid);
	    }
	  }, {
	    key: 'clearPrevious',
	    value: function clearPrevious() {
	      var _this = this;
	
	      this.grid.cells.forEach(function (cell) {
	        _this.scene.remove(cell);
	      });
	      this.grid.cells = [];
	    }
	  }, {
	    key: 'createBox',
	    value: function createBox() {
	      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.rollOverMesh.position.x;
	      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.rollOverMesh.position.y;
	
	      var gridY = (y - 5 + 500) / 10,
	          gridX = (x - 5 + 500) / 10,
	          box = new THREE.Mesh(this.rollOverGeo, this.normalMaterial);
	      box.position.set(x, y, 5);
	      box.name = gridX + ',' + gridY;
	
	      this.scene.add(box);
	      return box;
	    }
	  }, {
	    key: 'createRollOver',
	    value: function createRollOver() {
	      this.scene.add(this.rollOverMesh);
	    }
	  }, {
	    key: 'rollOverXPos',
	    value: function rollOverXPos() {
	      return (this.rollOverMesh.position.x - 5 + 500) / 10;
	    }
	  }, {
	    key: 'rollOverYPos',
	    value: function rollOverYPos() {
	      return (this.rollOverMesh.position.y - 5 + 500) / 10;
	    }
	  }, {
	    key: 'removeRollOver',
	    value: function removeRollOver() {
	      this.scene.remove(this.rollOverMesh);
	    }
	  }, {
	    key: 'onWindowResize',
	    value: function onWindowResize() {
	      this.camera.aspect = window.innerWidth / window.innerHeight;
	      this.camera.updateProjectionMatrix();
	      this.renderer.setSize(window.innerWidth, window.innerHeight);
	    }
	  }]);
	
	  return Scene;
	}();
	
	exports.default = Scene;

/***/ },
/* 4 */
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
	      var material = new THREE.LineBasicMaterial({ color: "#bdc5cd" });
	      return new THREE.LineSegments(geometry, material);
	    }
	  }]);
	
	  return Plane;
	}();
	
	exports.default = Plane;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.shiftPattern = shiftPattern;
	exports.createCross = createCross;
	exports.createBenchmark = createBenchmark;
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
	
	var GROWTH_GUN = exports.GROWTH_GUN = {
	  1: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 17, 18, 19, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38]
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
	
	function createBenchmark(x, y) {
	  var pattern = {};
	  pattern[x] = [];
	  for (var blockY = 0; blockY < y; blockY++) {
	    pattern[x].push(blockY);
	  }
	  return pattern;
	}
	
	// export function createRandom() {
	//   const determinate =  Math.floor(Math.random() * 100)
	//   if (determinate <= 10) return true;
	//   return false;
	// }
	
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