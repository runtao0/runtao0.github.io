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
