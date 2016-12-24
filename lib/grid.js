import * as Patterns from './patterns';

class Grid {
  constructor(rows = 50, cols = 75) {
    this.worldWidth = 500;
    this.worldHeight = 500;
    this.rows = rows;
    this.cols = cols;
    // this.lifeTracker = [];
    this.grid;
    this.lifeTracker = {};

    this.populationLogic = this.populationLogic.bind(this);
    this.initGliderGun = this.initGliderGun.bind(this);
    this.interateLifeTracker = this.interateLifeTracker.bind(this);
    this.createLifeTracker = this.createLifeTracker.bind(this);
    this.makeGrid = this.makeGrid.bind(this);
    this.createBox = this.createBox.bind(this);
    this.countNeighbors = this.countNeighbors.bind(this);
    this.step = this.step.bind(this);

    this.initGliderGun = this.initGliderGun.bind(this);

    this.createLifeTracker();
    this.makeGrid();
  }

  createLifeTracker() {
    for(let x = 0; x < this.rows; x++) {
      for(let y = 0; y < this.cols; y++) {
        this.lifeTracker[`${x},${y}`] = false;
      }
    }
  }

  createBox(x, y) {
    const tileWidth = this.worldWidth / this.cols,
    	tileHeight = this.worldHeight / this.rows,
      dx = ( this.rows / 2 - x ),
      dy = ( this.cols / 2 - y ),
      depth = tileWidth,
      xBase = (-this.worldWidth / 2) + (x * tileWidth) + (tileWidth / 2),
      yBase = (-this.worldHeight / 2) + (y * tileHeight) + (tileHeight / 2),
      zBase = depth / 2,
      box = new THREE.Mesh( new THREE.BoxBufferGeometry(tileWidth, tileHeight, depth),
                            new THREE.MeshPhongMaterial({
                              color: 'rgb(' + ~~((y / this.cols) * 255) + ', ' + ~~((x / this.rows) * 255) + ', 255)',
                              shininess: 50
                            })
                          );
      box.position.set(
        xBase,
        yBase,
        zBase
      );
    box.castShadow = true;
    box.receiveShadow = true;
    box.zBase = zBase;
    box.zScaleTarget = 1;

    return box;
  }

  makeGrid () {
    const grid = new THREE.Group();
    this.interateLifeTracker((x, y, coord) => {
      this.initGliderGun(x, y, coord, grid);
    });
    this.grid = grid;
  }
  // const lifeNum = Math.floor(Math.random() * 100)
  //
  // if(lifeNum <= 15) {
  //   grid.add(this.createBox(x, y));
  //   this.lifeTracker[x].push(true);
  // } else {
  //   this.lifeTracker[x].push(false);
  // }

  initGliderGun(x, y, coord, grid) {
    if (this.isPatternBlock(x, y, Patterns.GLIDER_GUN)) {
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

  step() {
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
