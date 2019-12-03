const { getFileInput } = require("../utils/getFileInput");

const calculateFuel = moduleMass => {
  return Math.floor(moduleMass / 3) - 2;
};

const calculateTotalFuel = moduleMass => {
  let fuelSum = 0;
  let fuel = calculateFuel(moduleMass);
  while (fuel > 0) {
    fuelSum += fuel;
    fuel = calculateFuel(fuel);
  }
  return fuelSum;
};

const sumFuel = (moduleMasses, fuelFromMassFunc) => {
  return moduleMasses
    .map(fuelFromMassFunc)
    .reduce((fuelSum, fuel) => fuelSum + fuel);
};

function solve() {
  const moduleMasses = getFileInput(__dirname + "/input").map(Number);
  const fuelSum = sumFuel(moduleMasses, calculateFuel);
  console.log("Part One", fuelSum);
  const totalFuelSum = sumFuel(moduleMasses, calculateTotalFuel);
  console.log("Part Two", totalFuelSum);
}

// solve();

module.exports = { calculateFuel, sumFuel, calculateTotalFuel };
