const { getFileInput } = require("../utils/getFileInput");

/**
 * @typedef {Object} Program
 * @property {number[]} memory
 * @property {number} pointer
 * @property {"running"|"halted"|"crashed"|"overflow"} status
 * @property {() => number} input
 * @property {number[]} output
 */

// solve();

function solve() {
  const lines = getFileInput(__dirname + "/input");
  const program = lines[0].split(",").map(Number);
  const input1 = () => 1;
  console.log("Part One", computeProgram(program, input1).output);
  const input2 = () => 5;
  console.log("Part Two", computeProgram(program, input2).output);
}

function computeProgram(memory, input) {
  /** @type {Program} */
  let program = {
    memory,
    pointer: 0,
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
  memory = memory.slice();
  const parameter = memory[pointer + 1];
  memory[parameter] = input();
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
