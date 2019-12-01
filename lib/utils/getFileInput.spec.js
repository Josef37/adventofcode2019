const { expect } = require("chai");
const { getFileInput } = require("./getFileInput");

describe("getFileInput", () => {
  it("resolves to an array of lines", () => {
    const data = getFileInput(__dirname + "/testlf");
    expect(data).to.be.an("array");
  });

  it("strips trailing newlines", () => {
    const data = getFileInput(__dirname + "/testlf");
    expect(data).to.have.length(3);
  });

  it("works with both crlf and lf line endlings the same way", () => {
    const datalf = getFileInput(__dirname + "/testlf");
    const datacrlf = getFileInput(__dirname + "/testcrlf");
    expect(datalf).to.eql(datacrlf);
  });
});
