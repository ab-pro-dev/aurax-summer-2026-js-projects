const EMPTY = "empty";
const SHIP = "ship";
const HIT = "hit";
const MISS = "miss";

const BOARD_SIZE = 10;
const SHIPS = [5, 4, 3, 3, 2];

let playerBoard = createBoard();
let computerBoard = createBoard();
let playerShips = [];
let computerShips = [];
let playerTurn = true;
let gameOver = false;
let gameStarted = false;
let moveCount = 0;

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
      const cells = [];
      for (let i = 0; i < length; i++) {
        if (horizontal) {
          board[row][col + i] = SHIP;
          cells.push({ row: row, col: col + i });
        } else {
          board[row + i][col] = SHIP;
          cells.push({ row: row + i, col: col });
        }
      }
      return cells;
    }
  }
}

function placeAllShips(board, ships) {
  const placed = [];
  for (let i = 0; i < ships.length; i++) {
    placed.push(placeShip(board, ships[i]));
  }
  return placed;
}

function updateStatus(text) {
  document.getElementById("message").textContent = text;
}

function allShipsSunk(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === SHIP) return false;
    }
  }
  return true;
}

function isShipSunk(board, shipCells) {
  for (let i = 0; i < shipCells.length; i++) {
    if (board[shipCells[i].row][shipCells[i].col] !== HIT) return false;
  }
  return true;
}

function findSunkShip(board, ships) {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].length > 0 && isShipSunk(board, ships[i])) {
      const sunk = ships[i];
      ships[i] = [];
      return sunk;
    }
  }
  return null;
}

function loadScore() {
  const data = JSON.parse(localStorage.getItem("battleship-score"));
  if (data) {
    document.getElementById("wins").textContent = data.wins;
    document.getElementById("losses").textContent = data.losses;
  }
}

function saveScore() {
  const wins = parseInt(document.getElementById("wins").textContent);
  const losses = parseInt(document.getElementById("losses").textContent);
  localStorage.setItem("battleship-score", JSON.stringify({ wins: wins, losses: losses }));
}

function addWin() {
  const el = document.getElementById("wins");
  el.textContent = parseInt(el.textContent) + 1;
  saveScore();
}

function addLoss() {
  const el = document.getElementById("losses");
  el.textContent = parseInt(el.textContent) + 1;
  saveScore();
}

function updateMoves() {
  moveCount++;
  document.getElementById("moves").textContent = moveCount;
}

function computerTurn() {
  playerTurn = false;
  updateStatus("Computer's turn...");
  setTimeout(function () {
    const available = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const s = playerBoard[r][c];
        if (s !== HIT && s !== MISS) {
          available.push({ row: r, col: c });
        }
      }
    }
    if (available.length === 0) return;
    const pick = available[Math.floor(Math.random() * available.length)];
    if (playerBoard[pick.row][pick.col] === SHIP) {
      playerBoard[pick.row][pick.col] = HIT;
    } else {
      playerBoard[pick.row][pick.col] = MISS;
    }
    renderBoard(playerBoard, "player-board", true);
    if (allShipsSunk(playerBoard)) {
      gameOver = true;
      addLoss();
      updateStatus("You Lose!");
      return;
    }
    const sunk = findSunkShip(playerBoard, playerShips);
    if (sunk) {
      updateStatus("Computer sank your ship!");
      setTimeout(function () {
        if (!gameOver) updateStatus("Your turn — attack the enemy waters!");
      }, 1500);
      playerTurn = true;
      return;
    }
    playerTurn = true;
    updateStatus("Your turn — attack the enemy waters!");
  }, 500);
}

function handleEnemyClick(e) {
  if (!gameStarted || !playerTurn || gameOver) return;
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
  updateMoves();
  renderBoard(computerBoard, "enemy-board", false);
  addEnemyListeners();
  if (allShipsSunk(computerBoard)) {
    gameOver = true;
    addWin();
    updateStatus("You Win!");
    return;
  }
  const sunk = findSunkShip(computerBoard, computerShips);
  if (sunk) {
    updateStatus("You sank a ship!");
    setTimeout(function () {
      if (!gameOver) updateStatus("Your turn — attack the enemy waters!");
    }, 1500);
    return;
  }
  computerTurn();
}

function addEnemyListeners() {
  const cells = document.querySelectorAll("#enemy-board .cell");
  cells.forEach(function (cell) {
    cell.addEventListener("click", handleEnemyClick);
  });
}

function startGame() {
  gameStarted = true;
  document.getElementById("start-btn").disabled = true;
  updateStatus("Your turn — attack the enemy waters!");
}

function resetGame() {
  playerBoard = createBoard();
  computerBoard = createBoard();
  playerShips = placeAllShips(playerBoard, SHIPS);
  computerShips = placeAllShips(computerBoard, SHIPS);
  playerTurn = true;
  gameOver = false;
  gameStarted = false;
  moveCount = 0;
  document.getElementById("moves").textContent = "0";
  document.getElementById("start-btn").disabled = false;
  updateStatus("Place your ships");
  renderBoard(playerBoard, "player-board", true);
  renderBoard(computerBoard, "enemy-board", false);
  addEnemyListeners();
}

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

loadScore();
playerShips = placeAllShips(playerBoard, SHIPS);
computerShips = placeAllShips(computerBoard, SHIPS);
renderBoard(playerBoard, "player-board", true);
renderBoard(computerBoard, "enemy-board", false);
addEnemyListeners();
