const { expect } = require("chai");
const rewire = require("rewire");
const script = rewire("./script.js");
const splitIntoLayers = script.__get__("splitIntoLayers");
const countDigits = script.__get__("countDigits");
const overlayLayers = script.__get__("overlayLayers");

describe("day 8", () => {
  it("splits into layers", () => {
    const pixels = [1, 2, 3, 4, 5, 6];
    expect(splitIntoLayers(pixels, 2)).to.eql([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
  });

  it("counts digits", () => {
    const layer = [1, 2, 2, 3, 3, 3];
    expect(countDigits(layer)).to.eql({ 1: 1, 2: 2, 3: 3 });
  });

  it("overlays layers", () => {
    const layers = splitIntoLayers("0222112222120000".split("").map(Number), 4);
    expect(overlayLayers(layers)).to.eql([0, 1, 1, 0]);
  });
});
