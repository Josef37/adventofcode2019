const { expect } = require("chai");
const {
  parseInput,
  getPossibleNextDigitsInBounds,
  checkDoubleDigit,
  checkHasDoubleDigitAlone,
  countNumbers
} = require("./script");

describe("day 4", () => {
  it("parses input", () => {
    const expected = { lower: [0, 1, 2, 3], upper: [6, 7, 8, 9] };
    expect(parseInput(123, 6789)).to.eql(expected);
  });

  it("gives the next possible digits to stay in bounds", () => {
    expect(getPossibleNextDigitsInBounds([1, 2], [3, 4], [2])).to.eql({
      lowerDigit: 0,
      upperDigit: 9
    });
    expect(getPossibleNextDigitsInBounds([1, 2], [1, 2], [1])).to.eql({
      lowerDigit: 2,
      upperDigit: 2
    });
    expect(getPossibleNextDigitsInBounds([1, 2], [1, 4], [1])).to.eql({
      lowerDigit: 2,
      upperDigit: 4
    });
  });

  it("checks if there is a double digit", () => {
    expect(checkDoubleDigit([1, 2])).to.eql(false);
    expect(checkDoubleDigit([])).to.eql(false);
    expect(checkDoubleDigit([1, 1])).to.eql(true);
    expect(checkDoubleDigit([3, 1, 1])).to.eql(true);
    expect(checkDoubleDigit([3, 1, 3])).to.eql(false);
  });

  it("checks if there is a double digit alone", () => {
    expect(checkHasDoubleDigitAlone([1, 2])).to.eql(false);
    expect(checkHasDoubleDigitAlone([])).to.eql(false);
    expect(checkHasDoubleDigitAlone([1, 1])).to.eql(true);
    expect(checkHasDoubleDigitAlone([3, 1, 1])).to.eql(true);
    expect(checkHasDoubleDigitAlone([3, 1, 3])).to.eql(false);
    expect(checkHasDoubleDigitAlone([3, 1, 1, 1])).to.eql(false);
    expect(checkHasDoubleDigitAlone([1, 1, 1, 2, 2])).to.eql(true);
  });

  it("counts all matching number", () => {
    expect(countNumbers([1, 1, 1], [1, 1, 1], [], checkDoubleDigit)).to.eql(1);
    expect(countNumbers([1, 1, 1], [1, 2, 2], [], checkDoubleDigit)).to.eql(10); // 111 - 119, 122
  });
});
