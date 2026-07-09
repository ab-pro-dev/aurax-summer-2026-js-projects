const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const gameStatusDisplay = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

function handleCellClick(e) {
  const cell = e.target;
  const index = Array.from(cells).indexOf(cell); 

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  currentPlayerDisplay.textContent = currentPlayer;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
