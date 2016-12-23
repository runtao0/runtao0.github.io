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

	"use strict";
	
	var _grid = __webpack_require__(1);
	
	var _grid2 = _interopRequireDefault(_grid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var camera = void 0,
	    controls = void 0,
	    scene = void 0,
	    renderer = void 0,
	    width = void 0,
	    height = void 0;
	width = window.innerWidth;
	height = window.innerHeight;
	
	function start() {
	  console.log("started");
	
	  scene = new THREE.Scene();
	  var cube = new THREE.CubeGeometry(100, 100, 100);
	  var material = new THREE.MeshNormalMaterial();
	  var mesh = new THREE.Mesh(cube, material);
	
	  scene.add(mesh);
	
	  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
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
	}
	
	function render() {
	  renderer.render(scene, camera);
	}
	
	window.start = start;
	window.animate = animate;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map