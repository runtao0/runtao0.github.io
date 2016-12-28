import * as Patterns from './patterns';

class Grid {
  constructor( rows, cols, lifeTracker = {} ) {
    //constants and multiplier
    this.worldWidth = rows * 10;
    this.worldHeight = cols * 10;
    this.rows = rows;
    this.cols = cols;
    this.multiplier = 1;
    //data storage
    this.grid;
    this.lifeTracker = lifeTracker;
    //methods
    // this.createLifeTracker = this.createLifeTracker.bind(this);
    this.createBox = this.createBox.bind(this);
    this.populationLogic = this.populationLogic.bind(this);
    this.interateLifeTracker = this.interateLifeTracker.bind(this);
    this.makeGrid = this.makeGrid.bind(this);
    this.countNeighbors = this.countNeighbors.bind(this);
    this.step = this.step.bind(this);
    //starting pattern methods
    this.initAll = this.initAll.bind(this);
    this.initGliderGun = this.initGliderGun.bind(this);
    this.initCross = this.initCross.bind(this);
    this.initGliderGun = this.initGliderGun.bind(this);
    //initialize data storage
    // this.createLifeTracker();
    this.makeGrid();
  }

  // createLifeTracker() {
  //   for( let x = 0; x < this.rows; x++ ) {
  //     for( let y = 0; y < this.cols; y++ ) {
  //       this.lifeTracker[`${x},${y}`] = false;
  //     }
  //   }
  // }

  createBox( x, y ) {
    const xBase = (-this.worldWidth / 2) + (x * 10) + (10 / 2),
      yBase = (-this.worldHeight / 2) + (y * 10) + (10 / 2),
      zBase = this.multiplier * (10 / 2),
      box = new THREE.Mesh( new THREE.BoxBufferGeometry(10, 10, 10),
                            new THREE.MeshBasicMaterial({
                              color: 'rgb(' + ~~((y / this.cols) * 255) + ', ' + ~~((x / this.rows) * 255) + ',' + ~~(255 - ((this.multiplier/ 251) * 255)) + ')',
                              opacity: 1,
                              transparent: true,
                            })
                          );
      box.position.set( xBase, yBase, zBase );
      box.name = `x: ${x}, y: ${y}`;

    return box;
  }

  makeGrid () {
    const grid = [];
    this.interateLifeTracker(( x, y, coord ) => {
      if (this.lifeTracker[coord]) grid.push(this.createBox(x, y));
    });
    this.grid = grid;
  }

  initAll(x, y, coord, grid) {
    grid.add(this.createBox(x, y));
    this.lifeTracker[coord] = true;
  }

  initRandom(x, y, coord, grid) {
    const lifeNum = Math.floor(Math.random() * 100)

    if(lifeNum <= 15) {
      grid.add(this.createBox(x, y));
      this.lifeTracker[coord] = true;
    } else {
      this.lifeTracker[coord] = false;
    }
  }

  initGliderGun(x, y, coord, grid) {
    if (this.isPatternBlock(x, y, Patterns.shiftGliderGunY(10))) {
      grid.add(this.createBox(x, y));
      this.lifeTracker[coord] = true;
    } else {
      this.lifeTracker[coord] = false;
    }
  }

  initCross(x, y, coord, grid) {
    if (this.isPatternBlock(x, y, Patterns.createCross(this.rows))) {
      grid.add(this.createBox(x, y));
      this.lifeTracker[coord] = true;
    } else {
      this.lifeTracker[coord] = false;
    }
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
    const newGrid = new THREE.Group();
    this.interateLifeTracker((x, y, coord) => {
      this.populationLogic(x, y, coord, newTracker, newGrid);
    });
    this.grid = newGrid;
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
        newGrid.add(this.createBox(x, y));
      } else if (aliveNeighbors > 3) {
        newTracker[coord] = false;
      }
    } else {
      if (aliveNeighbors < 3) {
        newTracker[coord] = false;
      } else if (aliveNeighbors === 3) {
        newTracker[coord] = true;
        newGrid.add(this.createBox(x, y));
      } else {
        newTracker[coord] = false;
      }
    }
  }

  countNeighbors(y, x) {
    const row_above = (y - 1 >= 0) ? (y - 1) : (this.cols - 1), // If current cell is on first row, cell "above" is the last row (stitched)
     row_below = (y + 1 <= this.cols - 1) ? (y + 1) : 0, // If current cell is in last row, then cell "below" is the first row
     column_left = (x - 1 >= 0) ? x - 1 : this.rows - 1, // If current cell is on first row, then left cell is the last row
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

  isPatternBlock(x, y, pattern) {
    if (pattern.hasOwnProperty(x)) {
      if (pattern[x].indexOf(y) > -1) {
        return true;
      }
    }
    return false;
  }
}

export default Grid;
