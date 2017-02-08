class Grid {
  constructor( rows, cols, lifeTracker) {
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
      transparent: true,
    });

    //initialize data storage
    this.makeGrid();
  }

  createBox( x, y ) {
    const xBase = (-this.worldWidth / 2) + (x * 10) + (10 / 2),
      yBase = (-this.worldHeight / 2) + (y * 10) + (10 / 2),
      zBase = this.multiplier * (10 / 2),
      // box = new THREE.Mesh( this.basicCell,
      //                       this.normalMaterial
      //                     );
      box = new THREE.BoxGeometry(10, 10 ,10);
      box.applyMatrix( new THREE.Matrix4().makeTranslation(xBase, yBase, zBase) );
    return box;
  }

  makeGrid () {
    const grid = [];
    this.interateLifeTracker(( x, y, coord ) => {
      if (this.lifeTracker[coord]) {
        grid.push( new THREE.Mesh(this.createBox(x, y), this.normalMaterial));
      }
    });
    this.grid = grid;
  }

  interateLifeTracker(callback) {
    Object.keys(this.lifeTracker).forEach((coord) => {
      const coordArray = coord.split(",");
      const x = parseInt(coordArray[0]);
      const y = parseInt(coordArray[1]);

      callback(x, y, coord);
    });
  }

  step(multiplier) {
    this.multiplier = multiplier;

    const newTracker = {};
    const newGrid = new THREE.BoxGeometry(0, 0, 0);
    this.interateLifeTracker((x, y, coord) => {
      this.populationLogic(x, y, coord, newTracker, newGrid);
    });
    this.grid = new THREE.Mesh( newGrid, this.normalMaterial );

    this.lifeTracker = newTracker;
  }

  populationLogic(x, y, coord, newTracker, newGrid) {
    const aliveNeighbors = this.countNeighbors(x, y);
    const thisCell = this.lifeTracker[coord];

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

  countNeighbors(y, x) {
    const row_above = (y - 1 >= 0) ? (y - 1) : (this.cols - 1),
     row_below = (y + 1 <= this.cols - 1) ? (y + 1) : 0,
     column_left = (x - 1 >= 0) ? x - 1 : this.rows - 1,
     column_right = (x + 1 <= this.rows - 1) ? x + 1 : 0;

    const neighbors = {
      top_left: this.lifeTracker[`${row_above},${column_left}`],
      top_center: this.lifeTracker[`${row_above},${x}`],
      top_right: this.lifeTracker[`${row_above},${column_right}`],
      left: this.lifeTracker[`${y},${column_left}`],
      right: this.lifeTracker[`${y},${column_right}`],
      bottom_left: this.lifeTracker[`${row_below},${column_left}`],
      bottom_center: this.lifeTracker[`${row_below},${x}`],
      bottom_right: this.lifeTracker[`${row_below},${column_right}`]
    };

    let aliveCount = 0;

    for (let neighbor in neighbors) {
      if (neighbors[neighbor]) aliveCount++;
    }

    return aliveCount
  }
}

export default Grid;
