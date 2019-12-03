const { expect } = require("chai");
const { computeProgram, execute, executeInstruction } = require("./script");

describe("day 2", () => {
  it("executes addition correctly", () => {
    const input = { program: [1, 0, 0, 0], pointer: 0, status: "running" };
    const computed = execute(input);
    expect(computed).to.eql({
      program: [2, 0, 0, 0],
      pointer: 4,
      status: "running"
    });
  });

  it("executes multiplication correctly", () => {
    const input = { program: [2, 3, 0, 3], pointer: 0, status: "running" };
    const computed = execute(input);
    expect(computed).to.eql({
      program: [2, 3, 0, 6],
      pointer: 4,
      status: "running"
    });
  });

  it("computes correctly", () => {
    const programs = [
      [1, 0, 0, 0, 99],
      [2, 3, 0, 3, 99],
      [2, 4, 4, 5, 99, 0],
      [1, 1, 1, 4, 99, 5, 6, 0, 99]
    ];
    const computed = programs.map(program => computeProgram(program));
    const expected = [
      [2, 0, 0, 0, 99],
      [2, 3, 0, 6, 99],
      [2, 4, 4, 5, 99, 9801],
      [30, 1, 1, 4, 2, 5, 6, 0, 99]
    ];
    expect(computed).to.eql(expected);
  });
});
