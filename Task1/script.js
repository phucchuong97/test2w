let N = 3;
let M = 3;

function genarateMap(n) {
  const map = document.querySelector(".map");
  map.innerHTML = "";
  for (let i = 0; i < n; i++) {
    let col = document.createElement("div");
    col.classList.add(`col${i}`);
    for (let j = 0; j < n; j++) {
      let ele = document.createElement("div");
      ele.dataset.location = `${j} ${i}`;
      col.appendChild(ele);
    }
    map.appendChild(col);
  }
}

let grid;
const startButton = document.querySelector(".start");
const inputN = document.querySelector("#n");
const inputM = document.querySelector("#m");

let isXTurn = true; // X go fisrt
let player = "X";
let isPlaying = false;

function play(e) {
  e.stopPropagation();
  if (!isPlaying) return;
  console.log(this.dataset);
  if (!this.dataset.isChecked) {
    this.dataset.isChecked = player;
    this.innerHTML = player;
    const winner = checkWinner(this, player);
    if (winner === "X") {
      malert("X Win");
    } else if (winner === "O") {
      malert("O Win");
    } else if (winner === "D") {
      malert("Draw");
    }
    isXTurn = !isXTurn;
    player = isXTurn ? "X" : "O";
  }
}

function malert(s) {
  isPlaying = false;
  setTimeout(function() {
    alert(s);
  }, 500);
}

// convert to 2d array
function mSlice(arr) {
  let temp = [];
  for (let i = 0; i < N; i++) {
    temp.push([]);
  }
  for (let i = 0; i < arr.length; i++) {
    temp[i % N].push(arr[i]);
  }
  return temp;
}

function checkWinner(currentLocation, player) {
  const map = mSlice([...grid]);
  console.log(map);
  const [row, col] = currentLocation.dataset.location
    .split(" ")
    .map(parseFloat);
  const rowTotal = checkRow({ row, col }, map, player);
  const colTotal = checkCol({ row, col }, map, player);
  const crossTotal = checkCross({ row, col }, map, player);
  const bcrossTotal = checBCross({ row, col }, map, player);
  console.log(player, rowTotal, colTotal, crossTotal, bcrossTotal);
  if (Math.max(rowTotal, colTotal, crossTotal, bcrossTotal) + 1 >= M)
    return player;
  else if (checkDraw()) return "D";
  return undefined;
}

function checkRow({ row, col }, map, player) {
  // console.log(map)
  let total = 0,
    temp = col + 1;
  while (temp < N && map[row][temp].dataset.isChecked === player) {
    total++;
    temp++;
  }
  temp = col - 1;
  while (temp >= 0 && map[row][temp].dataset.isChecked === player) {
    temp--;
    total++;
  }
  return total;
}

function checkCol({ row, col }, map, player) {
  //console.log("check col");
  let total = 0,
    temp = row + 1;
  while (temp < N && map[temp][col].dataset.isChecked === player) {
    total++;
    temp++;
  }
  temp = row - 1;
  while (temp >= 0 && map[temp][col].dataset.isChecked === player) {
    temp--;
    total++;
  }
  return total;
}
// /
function checkCross({ row, col }, map, player) {
  //console.log("check cross");
  let total = 0,
    tempr = row + 1, tempc = col - 1;
  while (tempc >= 0 && tempr < N && map[tempr][tempc].dataset.isChecked === player) {
    total++;
    tempc--;
    tempr++;
  }
  tempr = row - 1, tempc = col + 1;
  while (tempr >= 0 && tempc < N && map[tempr][tempc].dataset.isChecked === player) {
    tempc++;
    tempr--;
    total++;
  }
  return total;
}
// \
function checBCross({ row, col }, map, player) {
  //console.log("check bcross");
  let total = 0,
    tempr = row + 1, tempc = col + 1;
  while (tempc < N && tempr < N && map[tempr][tempc].dataset.isChecked === player) {
    total++;
    tempc++;
    tempr++;
  }
  tempr = row - 1, tempc = col - 1;
  while (tempr >= 0 && tempc>=0 && map[tempr][tempc].dataset.isChecked === player) {
    tempc--;
    tempr--;
    total++;
  }
  return total;
}

function checkDraw() {
  //console.log("check draw");
  let temp = [...grid];
  return temp.every(ele => ele.dataset.hasOwnProperty("isChecked"));
}

function start() {
  N = parseInt(inputN.value);
  M = parseInt(inputM.value);
  genarateMap(N);
  isPlaying = true;
  grid = document.querySelectorAll(".map div div");
  grid.forEach(cell => cell.addEventListener("click", play));
}

startButton.addEventListener("click", start);
