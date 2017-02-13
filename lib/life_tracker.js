class LifeTracker {
  constructor(rows = 100, cols = 100) {
    this.rows = rows;
    this.cols = cols;
    this.tracker = this.create();
  }

  create() {
    const tracker = {};
    for (let x = 0; x < this.rows; x++ ) {
      for (let y = 0; y < this.cols; y++ ) {
        tracker[`${ x },${ y }`] = false;
      }
    }
    return tracker;
  }

  isAlive(coord) {
    return this.tracker[coord];
  }

  setDead(x, y) {
    this.tracker[`${x},${y}`] = false;
  }

  setAlive(x, y) {
    this.tracker[`${x},${y}`] = true;
    // debugger
  }

  countLife() {
    let count = 0;
    for(let x in this.tracker) {
      if (this.tracker[x]) count ++;
    }
    return count > 10;
  }

  random() {
    this.iterate((x, y) => {
      const lifeNum = Math.floor( Math.random() * 100 );
      if( lifeNum <= 12 ) {
        this.setAlive(x, y);
      } else {
        this.setDead(x, y);
      }
    });
  }

  nextStep(callback) {
    const newTracker = {};
    this.iterate((x, y, coord) => {
      this._populationLogic(x, y, coord, newTracker, callback);
    });
    this.tracker = newTracker;
  }

  iterate(callback) {
    // debugger
    Object.keys(this.tracker).forEach((coord) => {
      const coordArray = coord.split(",");
      const x = parseInt(coordArray[0]);
      const y = parseInt(coordArray[1]);

      callback(x, y, coord);
    });
  }

  translatePattern(pattern) {

    for (let x in pattern) {
      for(let y = 0; y < pattern.x.length; y ++){
        newTracker[`${x},${pattern.x[y]}`] = true;
      }
    }
  }

  _populationLogic(x, y, coord, newTracker, callback) {

    const aliveNeighbors = this._countNeighbors(x, y);
    const thisCell = this.tracker[coord];

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

  _countNeighbors(y, x) {
    const row_above = (y - 1 >= 0) ? (y - 1) : (this.cols - 1),
     row_below = (y + 1 <= this.cols - 1) ? (y + 1) : 0,
     column_left = (x - 1 >= 0) ? x - 1 : this.rows - 1,
     column_right = (x + 1 <= this.rows - 1) ? x + 1 : 0;

    const neighbors = {
      top_left: this.tracker[`${row_above},${column_left}`],
      top_center: this.tracker[`${row_above},${x}`],
      top_right: this.tracker[`${row_above},${column_right}`],
      left: this.tracker[`${y},${column_left}`],
      right: this.tracker[`${y},${column_right}`],
      bottom_left: this.tracker[`${row_below},${column_left}`],
      bottom_center: this.tracker[`${row_below},${x}`],
      bottom_right: this.tracker[`${row_below},${column_right}`]
    };

    let aliveCount = 0;
    for (let neighbor in neighbors) {
      if (neighbors[neighbor]) aliveCount++;
    }

    return aliveCount
  }
}

export default LifeTracker;
