const N = 20,
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40;

// draw map
function genarateGrid(n) {
  const map = document.querySelector(".map");
  for (let i = 0; i < n * n; i++) {
    map.appendChild(document.createElement("div"));
  }
}
genarateGrid(N);
const grid = document.querySelectorAll(".map div");

let interval;
let isGameOver = false;
let isPlaying = false;
let lastDirection = LEFT;
let curDirection = LEFT;
// x,y: 0->19
let snakeCoords = [
  { row: 10, col: 10 }
];
let foodCoord = ramdomFood();

//Game mod A: Khi rắn di chuyển đè lên thân, rắn đụng tường (1.5đ)
//Game mod B: Khi rắn đến vị trí tường => xuất hiện ở vị trí đối diện (1.5đ)
let isModeA = false;

function drawSnake(isDraw) {
  const head = snakeCoords[0];
  isDraw
    ? grid[head.row * N + head.col].classList.add("snake-head")
    : grid[head.row * N + head.col].classList.remove("snake-head");
  for (let i = 1; i < snakeCoords.length; i++) {
    const body = snakeCoords[i];
    isDraw
      ? grid[body.row * N + body.col].classList.add("snake-body")
      : grid[body.row * N + body.col].classList.remove("snake-body");
  }
}

function drawFood(isDraw = true) {
  isDraw
    ? grid[foodCoord.row * N + foodCoord.col].classList.add("food")
    : grid[foodCoord.row * N + foodCoord.col].classList.remove("food");
}

function ateFood() {
  console.log("eat", snakeCoords, foodCoord);
  drawFood(false);
  snakeCoords.splice(1, 0, foodCoord);
  drawSnake();
  foodCoord = ramdomFood();
  drawFood();
}

function checkEatFood() {
  const head = snakeCoords[0];
  return head.row === foodCoord.row && head.col === foodCoord.col;
}

function moveSnake() {
  drawSnake(false);
  const curHead = snakeCoords[0];
  if (
    (curDirection === RIGHT && lastDirection === LEFT) ||
    (curDirection === LEFT && lastDirection === RIGHT) ||
    (curDirection === UP && lastDirection === DOWN) ||
    (curDirection === DOWN && lastDirection === UP)
  ) {
    snakeCoords.reverse();
    lastDirection = curDirection;
  } else {
    let temp;
    switch (curDirection) {
      case UP:
        //console.log("move up", curHead);
        temp = curHead.row - 1;
        if (!isModeA) temp = mRound(temp);
        snakeCoords.unshift({ row: temp, col: curHead.col });
        break;
      case LEFT:
        //console.log("move left");
        temp = curHead.col - 1;
        if (!isModeA) temp = mRound(temp);
        snakeCoords.unshift({ row: curHead.row, col: temp });
        break;
      case RIGHT:
        //console.log("move right");
        temp = curHead.col + 1;
        if (!isModeA) temp = mRound(temp);
        snakeCoords.unshift({ row: curHead.row, col: temp });
        break;
      case DOWN:
        //console.log("move down");
        temp = curHead.row + 1;
        if (!isModeA) temp = mRound(temp);
        snakeCoords.unshift({ row: temp, col: curHead.col });
        break;
    }
    if (isModeA && isEndInModeA(temp)) {
        console.log("check mode A")
      gameOver();
      return;
    }
    snakeCoords.pop();
  }
  if (checkEatFood()) {
    ateFood();
  }
  drawSnake(true);
}

function changeDirention(e) {
  lastDirection = curDirection;
  curDirection = e.keyCode;
  console.log(e.keyCode, curDirection);
}

function ramdomFood() {
  let col, row;
  while (true) {
    row = Math.floor(Math.random() * N);
    col = Math.floor(Math.random() * N);
    if (
      snakeCoords.every(coord => {
        return coord.row !== row && coord.col !== col;
      })
    )
      break;
  }

  return { row, col };
}

function mRound(n) {
  if (n >= N) return 0;
  else if (n < 0) return N - 1;
  else return n;
}

function start() {
  if (isGameOver || isPlaying) return;
  interval = setInterval(moveSnake, 1000);
  drawFood(true);
  isPlaying = true;
}

function stop() {
  clearInterval(interval);
  isPlaying = false;
  console.log(snakeCoords)
}

function gameOver() {
  isGameOver = true;
  stop();
  alert("Game Over!")
}

function changeMode() {
  if (isPlaying) return;
  isModeA = !isModeA;
  isModeA ? (modeTitle.innerHTML = "A") : (modeTitle.innerHTML = "B");
}

function isEndInModeA(n) {
  if (n >= N || n < 0) return true;
  const head = snakeCoords[0];
  for (let i = 1; i < snakeCoords.length; i++) {
    if (head.row === snakeCoords[i].row && head.col === snakeCoords[i].col)
      return true;
  }
  return false;
}
const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const mode = document.querySelector(".mode");
const modeTitle = document.querySelector(".game-mode");

document.onkeydown = changeDirention;
startButton.addEventListener("click", start);
stopButton.addEventListener("click", stop);
mode.addEventListener("click", changeMode);
