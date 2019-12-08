const { getFileInput } = require("../utils/getFileInput");

// solve();

function solve() {
  const pixels = getFileInput(__dirname + "/input")[0]
    .split("")
    .map(Number);
  const layers = splitIntoLayers(pixels, 25 * 6);
  console.log("Part One", partOne(layers));
  const image = overlayLayers(layers);
  printImage(image, { width: 25, height: 6 });
}

function partOne(layers) {
  const { 1: onesCount, 2: twosCount } = layers
    .map(layer => countDigits(layer))
    .reduce((minZero, count) => (minZero[0] < count[0] ? minZero : count));
  return onesCount * twosCount;
}

function printImage(image, { width, height }) {
  console.log(
    image.reduce((str, pixel, index) => {
      const char = pixel === 1 ? "▮" : " ";
      if (index % width === width - 1) return str + char + "\n";
      return str + char;
    }, "")
  );
}

function overlayLayers(layers) {
  return layers.reduce((finalLayer, layer) =>
    finalLayer.map((finalPixel, index) =>
      finalPixel === 2 ? layer[index] : finalPixel
    )
  );
}

function countDigits(layer) {
  return layer.reduce((count, digit) => {
    count[digit] = 1 + (count[digit] || 0);
    return count;
  }, {});
}

function splitIntoLayers(pixels, layerLength) {
  const layers = [];
  for (let i = 0; i < pixels.length; i += layerLength) {
    layers.push(pixels.slice(i, i + layerLength));
  }
  return layers;
}
