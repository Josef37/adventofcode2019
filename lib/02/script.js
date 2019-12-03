const { getFileInput } = require("../utils/getFileInput");

// solve();

function solve() {
  const data = getFileInput(__dirname + "/input")[0];
  const program = data.split(",").map(Number);
  program[1] = 12;
  program[2] = 2;
  console.log("Part One", computeProgram(program)[0]);

  const { noun, verb } = checkAllInputs(program, 19690720);
  console.log("Part Two", noun * 100 + verb);
}

function checkAllInputs(program, expectedOutput) {
  for (let noun = 0; noun < 100; noun++) {
    program[1] = noun;
    for (let verb = 0; verb < 100; verb++) {
      program[2] = verb;
      const output = computeProgram(program)[0];
      if (output === expectedOutput) {
        return { noun, verb };
      }
    }
  }
}

function computeProgram(inputProgram) {
  let { program, pointer, status } = {
    program: inputProgram,
    pointer: 0,
    status: "running"
  };
  while (status === "running") {
    ({ program, pointer, status } = execute({ program, pointer, status }));
  }
  return program;
}

function execute({ program, pointer, status }) {
  if (status !== "running") return { program, pointer, status };
  switch (program[pointer]) {
    case 99:
      return { program, pointer, status: "halted" };
    case 1:
      return executeInstruction({ program, pointer, status }, (a, b) => a + b);
    case 2:
      return executeInstruction({ program, pointer, status }, (a, b) => a * b);
    default:
      return { program, pointer, status: "crashed" };
  }
}

function executeInstruction({ program, pointer, status }, func) {
  program = program.slice();
  const parameters = [
    program[pointer + 1],
    program[pointer + 2],
    program[pointer + 3]
  ];
  program[parameters[2]] = func(program[parameters[0]], program[parameters[1]]);
  return { program, pointer: pointer + 4, status };
}

module.exports = {
  computeProgram,
  execute,
  executeInstruction
};
