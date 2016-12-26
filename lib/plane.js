class Plane {
  constructor(rows = 45, cols = 45) {
    this.rows = rows;
    this.cols = cols;

    this.plane = this.initPlane();
    this.grid = this.initGrid();
  }

  initPlane() {
    const geometry = new THREE.PlaneBufferGeometry( 450, 450 );
    return new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false, color: "#000000" } ) );
  }

  initGrid() {
    const size = 225;
    const step = (size/this.rows) * 2;
    const geometry = new THREE.Geometry();
    for ( var i = - size; i <= size + 1; i += step ) {
      console.log(`size: ${size}, i: ${i}`);
      geometry.vertices.push( new THREE.Vector3( - size, i, 0 ) );
      geometry.vertices.push( new THREE.Vector3(   size, i, 0 ) );
      geometry.vertices.push( new THREE.Vector3( i,- size, 0 ) );
      geometry.vertices.push( new THREE.Vector3( i, size, 0 ) );
    }
    var material = new THREE.LineBasicMaterial( { color: "#ffffff"} );
    return new THREE.LineSegments( geometry, material );
  }
}

export default Plane;
