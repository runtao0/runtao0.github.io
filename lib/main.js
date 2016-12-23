import Grid from './grid'

let camera, controls, scene, renderer, width, height;
width = window.innerWidth;
height = window.innerHeight;

function start() {
  console.log("started");

  scene = new THREE.Scene();
  const cube = new THREE.CubeGeometry(100, 100, 100);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(cube, material);

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
  renderer.render(scene, camera)
}

window.start = start;
window.animate = animate;
