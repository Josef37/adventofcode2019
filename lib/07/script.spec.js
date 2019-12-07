"use strict";

const { expect } = require("chai");

const rewire = require("rewire");
const script = rewire("./script");
const loopProgram = script.__get__("loopProgram"),
  findMaxOutput = script.__get__("findMaxOutput"),
  computeSequence = script.__get__("computeSequence"),
  computeProgram = script.__get__("computeProgram"),
  parseParameters = script.__get__("parseParameters"),
  executeInput = script.__get__("executeInput"),
  executeOutput = script.__get__("executeOutput"),
  executeAddition = script.__get__("executeAddition"),
  executeMultiplication = script.__get__("executeMultiplication"),
  executeJumpIfTrue = script.__get__("executeJumpIfTrue"),
  executeJumpIfFalse = script.__get__("executeJumpIfFalse"),
  executeLessThan = script.__get__("executeLessThan"),
  executeEquals = script.__get__("executeEquals");

describe("day 7", () => {
  it("loops correctly", () => {
    let memory = [
      3,
      26,
      1001,
      26,
      -4,
      26,
      3,
      27,
      1002,
      27,
      2,
      27,
      1,
      27,
      26,
      27,
      4,
      27,
      1001,
      28,
      -1,
      28,
      1005,
      28,
      6,
      99,
      0,
      0,
      5
    ];
    let sequence = [9, 8, 7, 6, 5];
    expect(loopProgram(memory, sequence)).to.eql(139629729);
    memory = [
      3,
      52,
      1001,
      52,
      -5,
      52,
      3,
      53,
      1,
      52,
      56,
      54,
      1007,
      54,
      5,
      55,
      1005,
      55,
      26,
      1001,
      54,
      -5,
      54,
      1105,
      1,
      12,
      1,
      53,
      54,
      53,
      1008,
      54,
      0,
      55,
      1001,
      55,
      1,
      55,
      2,
      53,
      55,
      53,
      4,
      53,
      1001,
      56,
      -1,
      56,
      1005,
      56,
      6,
      99,
      0,
      0,
      0,
      0,
      10
    ];
    sequence = [9, 7, 8, 5, 6];
    expect(loopProgram(memory, sequence)).to.eql(18216);
  });

  it("computes sequence output correctly", () => {
    let memory = [
      3,
      15,
      3,
      16,
      1002,
      16,
      10,
      16,
      1,
      16,
      15,
      15,
      4,
      15,
      99,
      0,
      0
    ];
    expect(computeSequence(memory, [4, 3, 2, 1, 0])).to.eql(43210);
    memory = [
      3,
      23,
      3,
      24,
      1002,
      24,
      10,
      24,
      1002,
      23,
      -1,
      23,
      101,
      5,
      23,
      23,
      1,
      24,
      23,
      23,
      4,
      23,
      99,
      0,
      0
    ];
    expect(computeSequence(memory, [0, 1, 2, 3, 4])).to.eql(54321);
    memory = [
      3,
      31,
      3,
      32,
      1002,
      32,
      10,
      32,
      1001,
      31,
      -2,
      31,
      1007,
      31,
      0,
      33,
      1002,
      33,
      7,
      33,
      1,
      33,
      31,
      31,
      1,
      32,
      31,
      31,
      4,
      31,
      99,
      0,
      0,
      0
    ];
    expect(computeSequence(memory, [1, 0, 4, 3, 2])).to.eql(65210);
  });

  it("finds the maximal sequence output", () => {
    let memory = [
      3,
      15,
      3,
      16,
      1002,
      16,
      10,
      16,
      1,
      16,
      15,
      15,
      4,
      15,
      99,
      0,
      0
    ];
    expect(findMaxOutput(memory, [0, 1, 2, 3, 4], computeSequence)).to.eql({
      output: 43210,
      sequence: [4, 3, 2, 1, 0]
    });
    memory = [
      3,
      23,
      3,
      24,
      1002,
      24,
      10,
      24,
      1002,
      23,
      -1,
      23,
      101,
      5,
      23,
      23,
      1,
      24,
      23,
      23,
      4,
      23,
      99,
      0,
      0
    ];
    expect(findMaxOutput(memory, [0, 1, 2, 3, 4], computeSequence)).to.eql({
      output: 54321,
      sequence: [0, 1, 2, 3, 4]
    });
    memory = [
      3,
      31,
      3,
      32,
      1002,
      32,
      10,
      32,
      1001,
      31,
      -2,
      31,
      1007,
      31,
      0,
      33,
      1002,
      33,
      7,
      33,
      1,
      33,
      31,
      31,
      1,
      32,
      31,
      31,
      4,
      31,
      99,
      0,
      0,
      0
    ];
    expect(findMaxOutput(memory, [0, 1, 2, 3, 4], computeSequence)).to.eql({
      output: 65210,
      sequence: [1, 0, 4, 3, 2]
    });
  });

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
