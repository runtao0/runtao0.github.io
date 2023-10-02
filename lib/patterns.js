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

export const GARDEN_EDEN = {
  6:  [17, 18, 19, 20, 21, 22,     24, 25],
  7:  [17, 18,     20, 22,     23, 24, 25],
  8:  [17,     19, 20, 21, 22, 23,     25],
  9:  [17, 18,     20,     22,     24, 25],
  10: [17,     19, 20, 21,     23, 24, 25],
  11: [17, 18, 19,     21, 22, 23,     25],
  12: [17, 18, 19, 20,     22, 23, 24, 25],
  13: [17, 18,     20, 21, 22,     24, 25],
  14: [17,     19, 20, 21,     23, 24, 25],
  15: [17, 18, 19,     21, 22, 23,     25],
  16: [17, 18, 19, 20,     22, 23, 24, 25],
  17: [17, 18,     20, 21, 22,     24, 25],
  18: [17,     19, 20, 21,     23, 24, 25],
  19: [17, 18, 19,     21, 22, 23,     25],
  20: [17, 18, 19, 20,     22, 23, 24, 25],
  21: [17,     19, 20, 21, 22,     24, 25],
  22: [17, 18,     20,     22, 23,     25],
  23: [17,     19, 20, 21, 22,     24, 25],
  24: [17, 18, 19,     21,     23, 24    ],
  25: [17,     19, 20, 21, 22,     24, 25],
  26: [17, 18,     20,     22, 23, 24, 25],
  27: [17,     19, 20, 21,     23,     25],
  28: [17, 18,     20,     22, 23, 24, 25],
  29: [17,     19, 20, 21,     23,     25],
  30: [17, 18,     20,     22, 23, 24, 25],
  31: [17,     19, 20, 21,     23,     25],
  32: [17, 18,     20,     22, 23, 24, 25],
  33: [17,     19, 20, 21,     23,     25],
  34: [17, 18,     20,     22, 23, 24, 25],
  35: [17,     19, 20, 21,     23,     25],
  36: [17, 18,     20,     22, 23, 24, 25],
  37: [17,     19, 20, 21,     23,     25],
  38: [17, 18,     20,     22, 23, 24, 25],
}

export const GROWTH_GUN = {
  1: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 17, 18, 19, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38]
}

export function shiftPattern(pattern, shiftX, shiftY) {
  const newPattern = {};
  for (let x in pattern) {
    x = parseInt(x);
    newPattern[(x + shiftX)] = [];
    pattern[x].forEach((y) => {
      newPattern[(x + shiftX)].push(y + shiftY);
    });
  }
  return newPattern;
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

export function createBenchmark(x, y) {
  const pattern = {};
  pattern[x] = [];
  for (let blockY = 0; blockY < y; blockY ++) {
    pattern[x].push(blockY);
  }
  return pattern;
}
