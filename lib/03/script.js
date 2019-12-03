const { getFileInput } = require("../utils/getFileInput");

// solve();

function solve() {
  const lines = getFileInput(__dirname + "/input");
  const closestDistance = findClosestIntersection(lines);
  console.log("Part One", closestDistance);
  const earliestDelay = findEarliestIntersection(lines);
  console.log("Part Two", earliestDelay);
}

function findEarliestIntersection(inputLines) {
  const paths = parseInput(inputLines);
  let grid = {};
  paths.forEach((path, index) => (grid = fillGrid(path, grid, index)));
  const intersections = findIntersections(grid);
  return findEarliest(intersections);
}

function findClosestIntersection(inputLines) {
  const paths = parseInput(inputLines);
  let grid = {};
  paths.forEach((path, index) => (grid = fillGrid(path, grid, index)));
  const intersections = findIntersections(grid);
  return findClosestDistance(intersections);
}

function findEarliest(intersections) {
  return intersections
    .map(([pos, delay]) =>
      Array.from(Object.values(delay)).reduce((a, b) => a + b)
    )
    .reduce((minDelay, delay) => Math.min(minDelay, delay));
}

function findClosestDistance(intersections) {
  return intersections
    .map(([pos, delay]) => {
      const [x, y] = pos.split(",").map(Number);
      return { x, y };
    })
    .reduce(
      (minDistance, { x, y }) => Math.min(minDistance, distance(x, y)),
      Infinity
    );
}

function distance(x, y) {
  return Math.abs(x) + Math.abs(y);
}

function findIntersections(grid) {
  return Object.entries(grid).filter(
    ([pos, paths]) => Object.keys(paths).length > 1
  );
}

function fillGrid(path, grid, pathname) {
  grid = Object.assign({}, grid);
  let pos = { x: 0, y: 0 };
  let delay = 0;
  for (let { direction, length } of path) {
    let { dx, dy } = parseDirection(direction);
    for (let l = 1; l <= length; l++) {
      pos = { x: pos.x + dx, y: pos.y + dy };
      delay++;
      const posString = `${pos.x},${pos.y}`;
      if (!grid[posString]) grid[posString] = {};
      if (!grid[posString][pathname]) grid[posString][pathname] = delay;
    }
  }
  return grid;
}

function parseDirection(direction) {
  switch (direction) {
    case "U":
      return { dx: 0, dy: 1 };
    case "R":
      return { dx: 1, dy: 0 };
    case "D":
      return { dx: 0, dy: -1 };
    case "L":
      return { dx: -1, dy: 0 };
    default:
      console.log("Invalid direction");
      return { dx: 0, dy: 0 };
  }
}

function parseInput(lines) {
  const paths = lines.map(line =>
    line.split(",").map(instruction => ({
      direction: instruction[0],
      length: Number(instruction.slice(1))
    }))
  );
  return paths;
}

module.exports = {
  parseInput,
  fillGrid,
  findIntersections,
  findClosestDistance,
  findClosestIntersection,
  findEarliestIntersection
};
