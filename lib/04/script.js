solve();

function solve() {
  const { lower, upper } = parseInput(158126, 624574);
  const countOne = countNumbers(lower, upper, [], checkDoubleDigit);
  console.log("Part One", countOne);
  const countTwo = countNumbers(lower, upper, [], checkHasDoubleDigitAlone);
  console.log("Part Two", countTwo);
}

/**
 *
 * @param {number[]} lower
 * @param {number[]} upper
 * @param {number[]} currentDigits
 * @param resultCheck checks the resulting number
 */
function countNumbers(lower, upper, currentDigits, resultCheck) {
  if (currentDigits.length === lower.length)
    return resultCheck(currentDigits) ? 1 : 0;

  let { lowerDigit, upperDigit } = getPossibleNextDigits(
    lower,
    upper,
    currentDigits
  );
  let sum = 0;
  for (let digit = lowerDigit; digit <= upperDigit; digit++) {
    sum += countNumbers(lower, upper, currentDigits.concat(digit), resultCheck);
  }
  return sum;
}

/**
 * Splits lower and upper bound into arrays of the same length
 * @param {number} lower
 * @param {number} upper
 * @returns {{lower: number[], upper: number[]}}
 */
function parseInput(lower, upper) {
  if (lower > upper) throw new Error("lower < upper");
  const upperArray = upper
    .toString()
    .split("")
    .map(Number);
  const lowerArray = lower
    .toString()
    .padStart(upperArray.length, "0")
    .split("")
    .map(Number);
  return { lower: lowerArray, upper: upperArray };
}

function getPossibleNextDigits(lower, upper, currentDigits) {
  let { lowerDigit, upperDigit } = getPossibleNextDigitsInBounds(
    lower,
    upper,
    currentDigits
  );
  if (currentDigits.length > 0)
    lowerDigit = Math.max(lowerDigit, currentDigits[currentDigits.length - 1]);
  return { lowerDigit, upperDigit };
}

/**
 * Computes the possible next digits for staying in bounds
 * @param {number[]} lower bound digits (same length as upper)
 * @param {number[]} upper bound digits
 * @param {number[]} currentDigits current digits which meet bounds
 * @returns {{lowerDigit: number, upperDigit: number}} possible next digits (including bounds)
 */
function getPossibleNextDigitsInBounds(lower, upper, currentDigits) {
  if (lower.length !== upper.length)
    throw new Error("lower.length !== upper.length");
  if (currentDigits.length >= lower.length)
    throw new Error("currentDigits.length >= lower.length");

  const { lowerAlwaysMet, upperAlwaysMet } = currentDigits.reduce(
    ({ lowerAlwaysMet, upperAlwaysMet }, digit, index) => ({
      lowerAlwaysMet: lowerAlwaysMet || digit > lower[index],
      upperAlwaysMet: upperAlwaysMet || digit < upper[index]
    }),
    { lowerAlwaysMet: false, upperAlwaysMet: false }
  );
  const lowerDigit = lowerAlwaysMet ? 0 : lower[currentDigits.length];
  const upperDigit = upperAlwaysMet ? 9 : upper[currentDigits.length];
  return { lowerDigit, upperDigit };
}

/**
 * @param {number[]} digits
 * @returns {boolean}
 */
function checkDoubleDigit(digits) {
  for (let i = 1; i < digits.length; i++) {
    const prevDigit = digits[i - 1];
    const digit = digits[i];
    if (prevDigit === digit) return true;
  }
  return false;
}

/**
 * @param {number[]} digits
 * @returns {boolean}
 */
function checkHasDoubleDigitAlone(digits) {
  let digitCount = 1;
  for (let i = 1; i < digits.length; i++) {
    const prevDigit = digits[i - 1];
    const digit = digits[i];
    if (prevDigit === digit) digitCount++;
    else if (digitCount === 2) return true;
    else digitCount = 1;
  }
  return digitCount === 2;
}

module.exports = {
  parseInput,
  getPossibleNextDigits,
  getPossibleNextDigitsInBounds,
  checkDoubleDigit,
  checkHasDoubleDigitAlone,
  countNumbers
};
