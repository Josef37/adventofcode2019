const { getFileInput } = require("../utils/getFileInput");
const { Graph, alg: GraphAlg } = require("@dagrejs/graphlib");

// solve();

function solve() {
  const orbitMap = getFileInput(__dirname + "/input");

  const orbitCount = countOrbits(orbitMap);
  console.log("Part One", orbitCount);

  const transfers = countTransfers(orbitMap);
  console.log("Part Two", transfers);
}

function countOrbits(orbitMap) {
  const treeMap = buildTreeMap(orbitMap);
  const orbitCount = countOrbitsRecursive(treeMap, "COM", 0);
  return orbitCount;
}

function countOrbitsRecursive(treeMap, node, depth) {
  return treeMap
    .successors(node)
    .reduce(
      (sum, node) => sum + countOrbitsRecursive(treeMap, node, depth + 1),
      depth
    );
}

function countTransfers(orbitMap) {
  const treeMap = buildTreeMap(orbitMap, false);
  const { distance } = GraphAlg.dijkstra(treeMap, "YOU")["SAN"];
  return distance - 2;
}

function buildTreeMap(orbitMap, directed = true) {
  const tree = new Graph();
  orbitMap
    .map(orbit => orbit.split(")"))
    .forEach(([center, orbit]) => {
      tree.setNode(center);
      tree.setNode(orbit);
      tree.setEdge(center, orbit);
      if (!directed) tree.setEdge(orbit, center);
    });
  return tree;
}

module.exports = {
  buildTreeMap,
  countOrbits,
  countTransfers
};
