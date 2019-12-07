const { getFileInput } = require("../utils/getFileInput");

/**
 * @typedef {Object} Program
 * @property {number[]} memory
 * @property {number} pointer
 * @property {"running"|"halted"|"crashed"|"overflow"} status
 * @property {() => number} input
 * @property {number[]} output
 */

/**
 * Computes sequence instructions on a given program and returns the last output
 * @callback computationCallback
 * @param {number[]} memory
 * @param {number[]} sequence
 * @param {number} [inputSignal = 0]
 * @returns {number} the last output
 */

// solve();

function solve() {
  const lines = getFileInput(__dirname + "/input");
  const memory = lines[0].split(",").map(Number);
  const maxOutput1 = findMaxOutput(memory, [0, 1, 2, 3, 4], computeSequence);
  console.log("Part One", maxOutput1.output);
  const maxOutput2 = findMaxOutput(memory, [5, 6, 7, 8, 9], loopProgram);
  console.log("Part One", maxOutput2.output);
}

/**
 * Runs the computation function for every possible sequence and returns the maximum
 * @param {number[]} memory
 * @param {number[]} initialSequence the sequence instructions which get permuted
 * @param {computationCallback} computationFunc
 * @returns {{sequence: number[], output: number}} the maximum sequence and output
 */
function findMaxOutput(memory, initialSequence, computationFunc) {
  let max = { sequence: [], output: -Infinity };
  const permutations = perm(initialSequence);
  for (let sequence of permutations) {
    const output = computationFunc(memory, sequence);
    if (output > max.output) {
      max = { sequence, output };
    }
  }
  return max;
}

/**
 * Compute the same program for each sequence element and connect output to next input.
 * Connect last output to first input.
 * Compute each program until waiting or halted. Pass output further and exit, when all programs halted.
 * @type {computationCallback}
 */
function loopProgram(memory, sequence, inputSignal = 0) {
  const programs = sequence.map(sequenceNumber =>
    computeProgram(memory, makeInputFunction([sequenceNumber]))
  );
  let output = [inputSignal];
  while (true) {
    let notWaitingCount = 0;
    for (let i = 0; i < programs.length; i++) {
      const { memory, pointer, status } = programs[i];
      if (status !== "waiting") {
        notWaitingCount++;
        continue;
      }
      programs[i] = computeProgram(memory, makeInputFunction(output), pointer);
      output = programs[i].output;
    }
    if (notWaitingCount === programs.length) break;
  }
  return programs[programs.length - 1].output[0];
}

/**
 * Returns all Permutations of an array
 * @param {Array} xs
 * @returns {Array<Array>}
 */
function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      ret.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]));
      }
    }
  }
  return ret;
}

/**
 * Computes a instruction of the same program in sequence with output connected to input
 * @type {computationCallback}
 */
function computeSequence(memory, sequence, inputSignal = 0) {
  for (let sequenceNumber of sequence) {
    const input = makeInputFunction([sequenceNumber, inputSignal]);
    inputSignal = computeProgram(memory, input).output[0];
  }
  return inputSignal;
}

/**
 * Generates an input function which will return the array one by one
 * @param {Array} array
 * @returns {() => any}
 */
function makeInputFunction(array) {
  function* inputMaker() {
    yield* array;
  }
  const inputGen = inputMaker();
  return () => inputGen.next().value;
}

/**
 * Executes a program until it stops running (halted, crashed, waiting)
 * @param {Array<number>} memory
 * @param {() => number | undefined)} input
 * @param {number} pointer the instruction pointer position
 */
function computeProgram(memory, input, pointer = 0) {
  /** @type {Program} */
  let program = {
    memory,
    pointer,
    status: "running",
    input,
    output: []
  };
  while (program.status === "running") {
    program = execute(program);
  }
  return program;
}

/**
 * Executes the next instruction in the program
 * @param {Program} program
 * @returns {Program} the new program
 */
function execute(program) {
  const { memory, pointer, status } = program;
  if (status !== "running") return program;
  if (pointer >= memory.length) return { ...program, status: "overflow" };
  const optcode = memory[pointer]
    .toString()
    .slice(-2)
    .padStart(2, "0");
  switch (optcode) {
    case "99":
      return { ...program, pointer: pointer + 1, status: "halted" };
    case "01":
      return { ...program, ...executeAddition(program) };
    case "02":
      return { ...program, ...executeMultiplication(program) };
    case "03":
      return { ...program, ...executeInput(program) };
    case "04":
      return { ...program, ...executeOutput(program) };
    case "05":
      return { ...program, ...executeJumpIfTrue(program) };
    case "06":
      return { ...program, ...executeJumpIfFalse(program) };
    case "07":
      return { ...program, ...executeLessThan(program) };
    case "08":
      return { ...program, ...executeEquals(program) };
    default:
      return { ...program, status: "crashed" };
  }
}

function parseParameters({ memory, pointer }, length = 3) {
  const mode = memory[pointer]
    .toString()
    .slice(0, -2)
    .padStart(length, "0")
    .split("")
    .map(Number)
    .reverse();
  const parameters = memory.slice(pointer + 1, pointer + 4);
  return parameters.map((parameter, index) =>
    mode[index] === 0 ? memory[parameter] : parameter
  );
}

function executeAddition(program) {
  return executeInstruction(program, (a, b) => a + b);
}
function executeMultiplication(program) {
  return executeInstruction(program, (a, b) => a * b);
}
function executeInstruction({ memory, pointer }, func) {
  memory = memory.slice();
  const parameters = parseParameters({ memory, pointer });
  memory[memory[pointer + 3]] = func(parameters[0], parameters[1]);
  return { memory, pointer: pointer + 4 };
}
function executeInput({ memory, pointer, input }) {
  const inputValue = input();
  if (inputValue === undefined) return { status: "waiting" };
  memory = memory.slice();
  const parameter = memory[pointer + 1];
  memory[parameter] = inputValue;
  return { memory, pointer: pointer + 2 };
}
function executeOutput({ memory, pointer, output }) {
  memory = memory.slice();
  const parameter = parseParameters({ memory, pointer })[0];
  output = output.concat(parameter);
  return { memory, pointer: pointer + 2, output };
}
function executeJumpIfTrue({ memory, pointer }) {
  return executeJumpIf({ memory, pointer }, number => number !== 0);
}
function executeJumpIfFalse({ memory, pointer }) {
  return executeJumpIf({ memory, pointer }, number => number === 0);
}
function executeJumpIf({ memory, pointer }, check) {
  const parameters = parseParameters({ memory, pointer });
  if (check(parameters[0])) return { pointer: parameters[1] };
  return { pointer: pointer + 3 };
}
function executeLessThan({ memory, pointer }) {
  return executeCompare({ memory, pointer }, (a, b) => a < b);
}
function executeEquals({ memory, pointer }) {
  return executeCompare({ memory, pointer }, (a, b) => a === b);
}
function executeCompare({ memory, pointer }, compare) {
  const parameters = parseParameters({ memory, pointer });
  memory = memory.slice();
  let output;
  if (compare(parameters[0], parameters[1])) output = 1;
  else output = 0;
  memory[memory[pointer + 3]] = output;
  return { memory, pointer: pointer + 4 };
}

module.exports = {
  loopProgram,
  findMaxOutput,
  computeSequence,
  computeProgram,
  execute,
  executeInstruction,
  parseParameters,
  executeInput,
  executeOutput,
  executeAddition,
  executeMultiplication,
  executeJumpIfTrue,
  executeJumpIfFalse,
  executeLessThan,
  executeEquals
};
