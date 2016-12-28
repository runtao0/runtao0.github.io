export const GLIDER_GUN = {
  1: [5, 6],
  2: [5, 6],
  11: [5, 6, 7],
  12: [4, 8],
  13: [3, 9],
  14: [3, 9],
  15: [6],
  16: [4, 8],
  17: [5, 6, 7],
  18: [6],
  21: [3, 4, 5],
  22: [3, 4, 5],
  23: [2, 6],
  25: [1, 2, 6, 7],
  35: [3, 4],
  36: [3, 4]
};

export function shiftGliderGunY(num) {
  const newGliderGun = {};
  for (let x in GLIDER_GUN) {
    newGliderGun[x] = [];
    GLIDER_GUN[x].forEach((y) => {
      newGliderGun[x].push(y + num);
    });
  }
  return newGliderGun;
}

export function createCross(size) {
  if (size % 2 !== 0) {
    size -= 1;
  }
  const leftBound = (size - 6)/2;
  const innerleft = leftBound + 2;

  const rightBound = (size - 6)/2 + 6;
  const innerRight = rightBound - 3;

  const crossCoords = {};
  for (let x = 0; x < size; x++) {
    if (x < leftBound || x >= rightBound) {
      crossCoords[x] = [x, size - x - 1];
    } else {
      if (x < innerleft || x > innerRight) {
        crossCoords[x] = [leftBound, leftBound + 1, leftBound + 2, leftBound + 3, leftBound + 4, leftBound + 5];
      } else {
        crossCoords[x] = [leftBound, leftBound + 1, leftBound + 4, leftBound + 5]
      }
    }
  }
  return crossCoords;
}

const welcome = [
  {gridX: 4, gridY: 4},
  {gridX: 4, gridY: 3},
  {gridX: 4, gridY: 2},
  {gridX: 4, gridY: 1},
  {gridX: 4, gridY: 0},
  {gridX: 5, gridY: 1},
  {gridX: 6, gridY: 2},
  {gridX: 7, gridY: 1},
  {gridX: 8, gridY: 0},
  {gridX: 8, gridY: 1},
  {gridX: 8, gridY: 2},
  {gridX: 8, gridY: 3},
  {gridX: 8, gridY: 4},
  {gridX: 10, gridY: 4},
  {gridX: 10, gridY: 3},
  {gridX: 10, gridY: 2},
  {gridX: 10, gridY: 1},
  {gridX: 10, gridY: 0},
  {gridX: 11, gridY: 0},
  {gridX: 12, gridY: 0},
  {gridX: 11, gridY: 2},
  {gridX: 11, gridY: 4},
  {gridX: 12, gridY: 4},
  {gridX: 14, gridY: 4},
  {gridX: 14, gridY: 3},
  {gridX: 14, gridY: 2},
  {gridX: 14, gridY: 1},
  {gridX: 14, gridY: 0},
  {gridX: 15, gridY: 0},
  {gridX: 16, gridY: 0},
  {gridX: 18, gridY: 0},
  {gridX: 19, gridY: 0},
  {gridX: 20, gridY: 0},
  {gridX: 18, gridY: 1},
  {gridX: 18, gridY: 2},
  {gridX: 18, gridY: 3},
  {gridX: 18, gridY: 4},
  {gridX: 19, gridY: 4},
  {gridX: 20, gridY: 4},
  {gridX: 22, gridY: 3},
  {gridX: 22, gridY: 4},
  {gridX: 22, gridY: 2},
  {gridX: 22, gridY: 1},
  {gridX: 22, gridY: 0},
  {gridX: 23, gridY: 0},
  {gridX: 24, gridY: 0},
  {gridX: 24, gridY: 1},
  {gridX: 24, gridY: 2},
  {gridX: 24, gridY: 3},
  {gridX: 24, gridY: 4},
  {gridX: 23, gridY: 4},
  {gridX: 26, gridY: 4},
  {gridX: 26, gridY: 2},
  {gridX: 26, gridY: 2},
  {gridX: 26, gridY: 3},
  {gridX: 26, gridY: 1},
  {gridX: 26, gridY: 0},
  {gridX: 27, gridY: 3},
  {gridX: 28, gridY: 2},
  {gridX: 29, gridY: 3},
  {gridX: 30, gridY: 4},
  {gridX: 30, gridY: 3},
  {gridX: 30, gridY: 2},
  {gridX: 30, gridY: 1},
  {gridX: 30, gridY: 0},
  {gridX: 32, gridY: 4},
  {gridX: 32, gridY: 3},
  {gridX: 32, gridY: 2},
  {gridX: 32, gridY: 1},
  {gridX: 32, gridY: 0},
  {gridX: 33, gridY: 0},
  {gridX: 34, gridY: 0},
  {gridX: 33, gridY: 2},
  {gridX: 33, gridY: 4},
  {gridX: 34, gridY: 4},
]
