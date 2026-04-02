import cabana from "../assets/cabana.png";
import chalet from "../assets/chalet.png";
import pool from "../assets/textureWater.png";
import vertical from "../assets/arrowStraight.png";
import horizontal from "../assets/horizontal.png";
import cross from "../assets/arrowCrossing.png";
import t_right from "../assets/arrowSplit_r.png";
import t_left from "../assets/arrowSplit_l.png";
import t_down from "../assets/arrowSplit_down.png";
import t_up from "../assets/arrowSplit_up.png";
import corner_r_up from "../assets/arrowCornerSquare_r_up.png";
import corner_l_up from "../assets/arrowCornerSquare_l_up.png";
import corner_r_down from "../assets/arrowCornerSquare_r_down.png";
import corner_l_down from "../assets/arrowCornerSquare_l_down.png";

export function parseGrid(ascii) {
  return ascii
    .trim()
    .split("\n")
    .map((row) => row.split(""));
}

function isConnectable(symbol) {
  return ["#", "W", "c", "p"].includes(symbol);
}

function getNeighbors(grid, x, y) {
  return {
    up: grid[y - 1]?.[x],
    right: grid[y]?.[x + 1],
    down: grid[y + 1]?.[x],
    left: grid[y]?.[x - 1],
  };
}

function getPathMask(neighbors) {
  let mask = 0;

  if (isConnectable(neighbors.up)) mask |= 1;
  if (isConnectable(neighbors.right)) mask |= 2;
  if (isConnectable(neighbors.down)) mask |= 4;
  if (isConnectable(neighbors.left)) mask |= 8;

  return mask;
}

function getPathTile(mask) {
  const map = {
    5: vertical,
    10: horizontal,
    3: corner_r_up,
    6: corner_r_down,
    12: corner_l_down,
    9: corner_l_up,
    7: t_right,
    11: t_up,
    13: t_left,
    14: t_down,
    15: cross,
  };
  return map[mask] || "isolated";
}

export function chooseTile(grid, x, y) {
  const symbol = grid[y][x];

  if (symbol === ".") return;
  if (symbol === "W") return cabana;
  if (symbol === "p") return pool;
  if (symbol === "c") return chalet;

  if (symbol === "#") {
    const neighbors = getNeighbors(grid, x, y);
    const mask = getPathMask(neighbors);
    const type = getPathTile(mask);
    return type;
  }

  return;
}

export function getCabanaMap(grid) {
  const visited = new Set();
  const map = {};
  let id = 1;

  function dfs(x, y, id) {
    const key = `${x},${y}`;
    if (visited.has(key)) return;
    if (grid[y]?.[x] !== "W") return;

    visited.add(key);
    map[key] = id++;

    dfs(x + 1, y, id);
    dfs(x - 1, y, id);
    dfs(x, y + 1, id);
    dfs(x, y - 1, id);
  }

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const key = `${x},${y}`;
      if (grid[y][x] === "W" && !visited.has(key)) {
        dfs(x, y, id);
        id++;
      }
    }
  }
  return map;
}
