"use strict";

const { expect } = require("chai");
const {
  computeProgram,
  execute,
  parseParameters,
  executeInput,
  executeOutput,
  executeAddition,
  executeMultiplication,
  executeJumpIfTrue,
  executeJumpIfFalse,
  executeLessThan,
  executeEquals
} = require("./script");

describe("day 5", () => {
  it("executes addition correctly", () => {
    const program = { memory: [1, 0, 0, 0], pointer: 0, status: "running" };
    const computed = executeAddition(program);
    expect(computed).to.eql({
      memory: [2, 0, 0, 0],
      pointer: 4
    });
  });

  it("executes multiplication correctly", () => {
    const program = { memory: [2, 3, 0, 3], pointer: 0, status: "running" };
    const computed = executeMultiplication(program);
    expect(computed).to.eql({
      memory: [2, 3, 0, 6],
      pointer: 4
    });
  });

  it("executes input correctly", () => {
    const input = () => 100;
    const program = {
      memory: [3, 1],
      pointer: 0,
      input
    };
    const computed = executeInput(program);
    expect(computed).to.eql({
      memory: [3, 100],
      pointer: 2
    });
  });

  it("executes output correctly", () => {
    const program = {
      memory: [4, 2, 50],
      pointer: 0,
      output: []
    };
    const computed = executeOutput(program);
    expect(computed).to.eql({
      memory: [4, 2, 50],
      pointer: 2,
      output: [50]
    });
  });

  it("executes jump-if-true", () => {
    const programs = [
      { memory: [5, 3, 0, 1], pointer: 0 },
      { memory: [5, 3, 0, 0], pointer: 0 }
    ];
    const expected = [{ pointer: 5 }, { pointer: 3 }];
    programs.forEach((program, index) =>
      expect(executeJumpIfTrue(program)).to.eql(expected[index])
    );
  });

  it("executes jump-if-false", () => {
    const programs = [
      { memory: [6, 3, 0, 1], pointer: 0 },
      { memory: [6, 3, 0, 0], pointer: 0 }
    ];
    const expected = [{ pointer: 3 }, { pointer: 6 }];
    programs.forEach((program, index) =>
      expect(executeJumpIfFalse(program)).to.eql(expected[index])
    );
  });

  it("executes less than", () => {
    const programs = [
      { memory: [7, 4, 5, 3, -1, 1], pointer: 0 },
      { memory: [7, 4, 5, 3, 1, 1], pointer: 0 }
    ];
    const expected = [
      { memory: [7, 4, 5, 1, -1, 1], pointer: 4 },
      { memory: [7, 4, 5, 0, 1, 1], pointer: 4 }
    ];
    programs.forEach((program, index) =>
      expect(executeLessThan(program)).to.eql(expected[index])
    );
  });

  it("executes equals", () => {
    const programs = [
      { memory: [8, 4, 5, 3, -1, 1], pointer: 0 },
      { memory: [8, 4, 5, 3, 1, 1], pointer: 0 }
    ];
    const expected = [
      { memory: [8, 4, 5, 0, -1, 1], pointer: 4 },
      { memory: [8, 4, 5, 1, 1, 1], pointer: 4 }
    ];
    programs.forEach((program, index) =>
      expect(executeEquals(program)).to.eql(expected[index])
    );
  });

  it("parses parameters correctly", () => {
    const program = { memory: [1102, 100, 200, 4, 300], pointer: 0 };
    const expected = [100, 200, 300];
    expect(parseParameters(program)).to.eql(expected);
  });

  it("also works in immediate mode", () => {
    const input = () => 100;
    const memory = [1101, 100, 100, 3, 4, 3, 104, 100];
    const computed = computeProgram(memory, input);
    expect(computed).to.eql({
      memory: [1101, 100, 100, 200, 4, 3, 104, 100],
      pointer: 8,
      status: "overflow",
      input,
      output: [200, 100]
    });
  });

  it("works with negative numbers", () => {
    const input = () => -100;
    const memory = [3, 1, 1001, 1, -200, 5];
    const computed = computeProgram(memory, input);
    expect(computed).to.eql({
      memory: [3, -100, 1001, 1, -200, -300],
      pointer: 6,
      status: "overflow",
      input,
      output: []
    });
  });

  it("computes correctly", () => {
    const programs = [
      [1, 0, 0, 0, 99],
      [2, 3, 0, 3, 99],
      [2, 4, 4, 5, 99, 0],
      [1, 1, 1, 4, 99, 5, 6, 0, 99]
    ];
    const expected = [
      [2, 0, 0, 0, 99],
      [2, 3, 0, 6, 99],
      [2, 4, 4, 5, 99, 9801],
      [30, 1, 1, 4, 2, 5, 6, 0, 99]
    ];
    programs.forEach((program, index) =>
      expect(computeProgram(program).memory).to.eql(expected[index])
    );
  });

  it("computes jumps correctly", () => {
    const memory = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
    expect(computeProgram(memory, () => 0).output).to.eql([0]);
    expect(computeProgram(memory, () => 1).output).to.eql([1]);
  });

  it("computes comparisons correctly", () => {
    const memory = [
      3,
      21,
      1008,
      21,
      8,
      20,
      1005,
      20,
      22,
      107,
      8,
      21,
      20,
      1006,
      20,
      31,
      1106,
      0,
      36,
      98,
      0,
      0,
      1002,
      21,
      125,
      20,
      4,
      20,
      1105,
      1,
      46,
      104,
      999,
      1105,
      1,
      46,
      1101,
      1000,
      1,
      20,
      4,
      20,
      1105,
      1,
      46,
      98,
      99
    ];
    expect(computeProgram(memory, () => 7).output).to.eql([999]);
    expect(computeProgram(memory, () => 8).output).to.eql([1000]);
    expect(computeProgram(memory, () => 9).output).to.eql([1001]);
  });
});
