const fs = require("fs");

const getFileInput = abspath => {
  const data = fs.readFileSync(abspath, "utf8");
  const lines = data.split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) lines.pop();
    else break;
  }
  return lines;
};

module.exports = {
  getFileInput
};
