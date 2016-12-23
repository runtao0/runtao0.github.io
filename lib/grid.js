class Grid {
  constructor(rows = 30, cols = 30) {
    this.worldWidth = 200;
    this.worldHeight = 200;
    this.grid = this.makeGrid(rows, cols);
  }


  makeGrid (rows, cols) {
    const tileWidth = this.worldWidth / cols;
  	const tileHeight = this.worldHeight / rows;

    const grid = new THREE.Object3D();
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        var width = tileWidth,
        			height = tileHeight,
        			dx = ( rows / 2 - x ),
        			dy = ( cols / 2 - y ),
        			depth = 1 + ( 20 - Math.sqrt( dx * dx + dy * dy ) ) / 4,
        			xBase = -this.worldWidth / 2 + x * tileWidth + tileWidth / 2,
        			yBase = -this.worldHeight / 2 + y * tileHeight + tileHeight / 2,
        			zBase = depth / 2,
        			box = new THREE.Mesh(
        				new THREE.BoxGeometry( width, height, depth ),
        				new THREE.MeshPhongMaterial({
        					color: 'rgb(' + ~~( ( y / cols ) * 255 ) + ', ' + ~~( ( x / rows ) * 255 ) + ', 255)',
        					shininess: 50
        				})
        			);
              console.log(xBase, yBase, zBase);
        		box.position.set(
        			xBase,
        			yBase,
        			zBase
        		);
        		box.castShadow = true;
        		box.receiveShadow = true;
        		box.zBase = zBase;
        		box.zScaleTarget = 1;
        // 		cubes.add( cube );
        grid.add(box);
      }
    }
    return grid;
  }


}

export default Grid;
