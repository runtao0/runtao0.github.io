class Plane {
  constructor( rows, cols ) {
    this.rows = rows;
    this.cols = cols;

    this.plane = this.initPlane();
    this.grid = this.initGrid();
  }

  initPlane() {
    const geometry = new THREE.PlaneBufferGeometry( (this.rows * 10), (this.cols * 10));
    return new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false, color: "#000000" } ) );
  }

  initGrid() {
    const size = 500;
    const step = 10;
    const geometry = new THREE.Geometry();
    for ( let i = - size; i <= size + 1; i += step ) {
      geometry.vertices.push( new THREE.Vector3( - size, i, 0 ) );
      geometry.vertices.push( new THREE.Vector3(   size, i, 0 ) );
      geometry.vertices.push( new THREE.Vector3( i,- size, 0 ) );
      geometry.vertices.push( new THREE.Vector3( i, size, 0 ) );
    }
    const material = new THREE.LineBasicMaterial( { color: "#bdc5cd"} );
    return new THREE.LineSegments( geometry, material );
  }
}

export default Plane;
