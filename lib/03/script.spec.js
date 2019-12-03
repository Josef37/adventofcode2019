const { expect } = require("chai");
const {
  parseInput,
  fillGrid,
  findIntersections,
  findClosestDistance,
  findClosestIntersection,
  findEarliestIntersection
} = require("./script");

describe("day 3", () => {
  it("parses input correctly", () => {
    const lines = ["R10,L12", "U1,D102"];
    const expected = [
      [
        { direction: "R", length: 10 },
        { direction: "L", length: 12 }
      ],
      [
        { direction: "U", length: 1 },
        { direction: "D", length: 102 }
      ]
    ];
    expect(parseInput(lines)).to.eql(expected);
  });

  it("fills grid correctly", () => {
    const grid = {};
    const path = [
      { direction: "R", length: 2 },
      { direction: "U", length: 2 },
      { direction: "L", length: 1 },
      { direction: "D", length: 3 }
    ];
    const expected = {
      "1,0": { 1: 1 },
      "2,0": { 1: 2 },
      "2,1": { 1: 3 },
      "2,2": { 1: 4 },
      "1,2": { 1: 5 },
      "1,1": { 1: 6 },
      "1,-1": { 1: 8 }
    };
    expect(fillGrid(path, grid, 1)).to.eql(expected);
  });

  it("finds intersections", () => {
    const grid = {
      "1,0": { 1: 1, 2: 1 },
      "2,0": { 1: 2 },
      "2,1": { 1: 3 },
      "2,2": { 1: 4, 2: 1 },
      "1,2": { 1: 5 },
      "1,1": { 1: 6 },
      "1,-1": { 1: 8 }
    };
    const expectedIntersections = [
      ["1,0", { 1: 1, 2: 1 }],
      ["2,2", { 1: 4, 2: 1 }]
    ];
    expect(findIntersections(grid)).to.eql(expectedIntersections);
  });

  it("finds closest distance", () => {
    const intersections = [
      ["1,0", { 1: 1, 2: 1 }],
      ["2,2", { 1: 4, 2: 1 }]
    ];
    expect(findClosestDistance(intersections)).to.eql(1);
  });

  it("computes distance from input", () => {
    const lines1 = [
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83"
    ];
    const lines2 = [
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
    ];
    expect(findClosestIntersection(lines1)).to.eql(159);
    expect(findClosestIntersection(lines2)).to.eql(135);
  });

  it("computes delay from input", () => {
    const lines1 = [
      "R75,D30,R83,U83,L12,D49,R71,U7,L72",
      "U62,R66,U55,R34,D71,R55,D58,R83"
    ];
    const lines2 = [
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
      "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
    ];
    expect(findEarliestIntersection(lines1)).to.eql(610);
    expect(findEarliestIntersection(lines2)).to.eql(410);
  });
});
