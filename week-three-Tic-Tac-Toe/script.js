const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const gameStatusDisplay = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
