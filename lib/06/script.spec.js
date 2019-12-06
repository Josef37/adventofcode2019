const { expect } = require("chai");
const { buildTreeMap, countOrbits, countTransfers } = require("./script");

describe("day 6", () => {
  it("counts orbit checksum", () => {
    const map = [
      "COM)B",
      "B)C",
      "C)D",
      "D)E",
      "E)F",
      "B)G",
      "G)H",
      "D)I",
      "E)J",
      "J)K",
      "K)L"
    ];
    expect(countOrbits(map)).to.eql(42);
  });

  it("builds tree map", () => {
    const map = ["COM)B", "B)C", "C)D", "C)E"];
    const tree = buildTreeMap(map);
    expect(tree.nodeCount()).to.eql(5);
    expect(tree.edges()).to.eql([
      { v: "COM", w: "B" },
      { v: "B", w: "C" },
      { v: "C", w: "D" },
      { v: "C", w: "E" }
    ]);
  });

  it("counts transfers", () => {
    const map = [
      "COM)B",
      "B)C",
      "C)D",
      "D)E",
      "E)F",
      "B)G",
      "G)H",
      "D)I",
      "E)J",
      "J)K",
      "K)L",
      "K)YOU",
      "I)SAN"
    ];
    expect(countTransfers(map)).to.eql(4);
  });
});
