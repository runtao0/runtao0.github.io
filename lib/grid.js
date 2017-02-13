import LifeTracker from './life_tracker';

class Grid {
  constructor( rows = 100, cols = 100, lifeTracker = new LifeTracker()) {
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
      transparent: true,
    });


    this.createBox = this.createBox.bind(this);
  }

  createBox( x, y ) {
    const xBase = (-this.worldWidth / 2) + (x * 10) + (10 / 2),
      yBase = (-this.worldHeight / 2) + (y * 10) + (10 / 2),
      zBase = this.multiplier * (10 / 2),
      box = new THREE.BoxGeometry(10, 10 ,10);
      box.applyMatrix( new THREE.Matrix4().makeTranslation(xBase, yBase, zBase) );
    return box;
  }

  makeGrid () {
    const grid = [];
    this.lifeTracker.iterate(( x, y, coord ) => {
      if (this.lifeTracker.isAlive(coord)) {
        grid.push(new THREE.Mesh(this.createBox(x, y), this.normalMaterial));
      }
    });
    this.cells = grid;
  }

  step(multiplier) {
    this.multiplier = multiplier;

    const newTracker = {};
    const newGrid = new THREE.BoxGeometry(0, 0, 0);

    this.lifeTracker.nextStep((x, y) => {
      newGrid.merge(this.createBox(x, y));
    });

    const newGridBuffer = new THREE.BufferGeometry().fromGeometry(newGrid);
    this.cells = new THREE.Mesh( newGridBuffer, this.normalMaterial );
  }
}

export default Grid;
