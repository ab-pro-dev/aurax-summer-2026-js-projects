const EMPTY = "empty";
const SHIP = "ship";
const HIT = "hit";
const MISS = "miss";

const BOARD_SIZE = 10;

function createBoard() {
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const r = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      r.push(EMPTY);
    }
    board.push(r);
  }
  return board;
}

function renderBoard(board, containerId, showShips) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      const state = board[row][col];
      if (state === SHIP && showShips) {
        cell.classList.add("ship");
      } else if (state === HIT) {
        cell.classList.add("hit");
        cell.textContent = "X";
      } else if (state === MISS) {
        cell.classList.add("miss");
      }
      container.appendChild(cell);
    }
  }
}

const SHIPS = [5, 4, 3, 3, 2];

function canPlace(board, row, col, length, horizontal) {
  if (horizontal) {
    if (col + length > BOARD_SIZE) return false;
    for (let i = 0; i < length; i++) {
      if (board[row][col + i] !== EMPTY) return false;
    }
  } else {
    if (row + length > BOARD_SIZE) return false;
    for (let i = 0; i < length; i++) {
      if (board[row + i][col] !== EMPTY) return false;
    }
  }
  return true;
}

function placeShip(board, length) {
  const horizontal = Math.random() < 0.5;
  while (true) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    if (canPlace(board, row, col, length, horizontal)) {
      for (let i = 0; i < length; i++) {
        if (horizontal) {
          board[row][col + i] = SHIP;
        } else {
          board[row + i][col] = SHIP;
        }
      }
      return;
    }
  }
}

function placeAllShips(board, ships) {
  for (let i = 0; i < ships.length; i++) {
    placeShip(board, ships[i]);
  }
}

function handleEnemyClick(e) {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const state = computerBoard[row][col];
  if (state === HIT || state === MISS) return;
  if (state === SHIP) {
    computerBoard[row][col] = HIT;
  } else {
    computerBoard[row][col] = MISS;
  }
renderBoard(computerBoard, "enemy-board", false);
addEnemyListeners();
  addEnemyListeners();
}

function addEnemyListeners() {
  const cells = document.querySelectorAll("#enemy-board .cell");
  cells.forEach(function (cell) {
    cell.addEventListener("click", handleEnemyClick);
  });
}

const playerBoard = createBoard();
const computerBoard = createBoard();
placeAllShips(playerBoard, SHIPS);
placeAllShips(computerBoard, SHIPS);

renderBoard(playerBoard, "player-board", true);
renderBoard(computerBoard, "enemy-board", false);
