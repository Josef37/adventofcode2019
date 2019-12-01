const { expect } = require("chai");
const { calculateFuel, calculateTotalFuel, sumFuel } = require("./script");

describe("day 1", () => {
  it("calculates first fuel requirement per module correctly", () => {
    const moduleMasses = [12, 14, 1969, 100756];
    const expectedFuel = [2, 2, 654, 33583];
    const calculatedFuel = moduleMasses.map(mass => calculateFuel(mass));
    expect(calculatedFuel).to.eql(expectedFuel);
  });

  it("calculates total fuel requirements per module correctly", () => {
    const moduleMasses = [14, 1969, 100756];
    const expectedFuel = [2, 966, 50346];
    const calculatedFuel = moduleMasses.map(mass => calculateTotalFuel(mass));
    expect(calculatedFuel).to.eql(expectedFuel);
  });

  it("sums fuel requiremts", () => {
    const moduleMasses = Array(10).fill(10);
    const fuelFromMassFunc = mass => mass / 2;
    const fuelSum = sumFuel(moduleMasses, fuelFromMassFunc);
    expect(fuelSum).to.equal(50);
  });
});
