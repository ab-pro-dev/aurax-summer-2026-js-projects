// ── Button Elements ────────────────────────────────────────────────────────────
// These three buttons are how the player makes their choice each round.
// We need references to them so we can attach click event listeners later.
const btnRock     = document.querySelector('#btn-rock');
const btnPaper    = document.querySelector('#btn-paper');
const btnScissors = document.querySelector('#btn-scissors');

// The restart button resets scores and clears the display back to its initial
// state. We need a reference so we can listen for clicks on it.
const btnRestart  = document.querySelector('#btn-restart');


// ── Result Display Elements ────────────────────────────────────────────────────
// This <p> shows what the player chose (e.g. "Rock").
// We need it so we can update its text content after every round.
const playerChoiceDisplay   = document.querySelector('#player-choice-display');

// This <p> shows what the computer randomly chose.
// Same reason — we update its text content each round.
const computerChoiceDisplay = document.querySelector('#computer-choice-display');

// This <p> shows the outcome of each round: "You win!", "You lose!", or "Draw!".
// We also use this element to apply different text colours depending on the result.
const roundResultDisplay    = document.querySelector('#round-result-display');


// ── Scoreboard Elements ────────────────────────────────────────────────────────
// This <p> holds the player's running score.
// We update its text content whenever the player wins a round.
const playerScoreDisplay   = document.querySelector('#player-score-display');

// This <p> holds the computer's running score.
// We update its text content whenever the computer wins a round.
const computerScoreDisplay = document.querySelector('#computer-score-display');


// ── Score Variables ────────────────────────────────────────────────────────────
let playerScore   = 0;
let computerScore = 0;


// ── Computer Choice ────────────────────────────────────────────────────────────
// Returns one of three strings at random, simulating the computer's pick.
function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}


// ── Display Update ─────────────────────────────────────────────────────────────
// Capitalises the first letter of a choice string for display (e.g. "rock" → "Rock").
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Takes the player's choice, gets the computer's choice, runs the round,
// then writes all three results and the updated scores to the page.
function updateDisplay(choice) {
  const computerChoice = getComputerChoice();
  const result         = playRound(choice, computerChoice);

  // Update scores
  if (result === 'Player Wins')   playerScore++;
  if (result === 'Computer Wins') computerScore++;

  // Render choices and result
  playerChoiceDisplay.textContent   = capitalise(choice);
  computerChoiceDisplay.textContent = capitalise(computerChoice);
  roundResultDisplay.textContent    = result;

  // Render scores
  playerScoreDisplay.textContent   = playerScore;
  computerScoreDisplay.textContent = computerScore;

  // Check for a winner
  if (playerScore === 5 || computerScore === 5) {
    endGame();
  }
}

// ── Game Over ──────────────────────────────────────────────────────────────────
function endGame() {
  roundResultDisplay.textContent = playerScore === 5 ? '🎉 You Win!' : '💻 Computer Wins!';

  // Disable all three choice buttons so no more rounds can be played
  btnRock.disabled     = true;
  btnPaper.disabled    = true;
  btnScissors.disabled = true;
}

// ── Player Choice Detection ────────────────────────────────────────────────────
btnRock.addEventListener('click', () => {
  updateDisplay('rock');
});

btnPaper.addEventListener('click', () => {
  updateDisplay('paper');
});

btnScissors.addEventListener('click', () => {
  updateDisplay('scissors');
});


// ── Round Logic ────────────────────────────────────────────────────────────────
function playRound(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'Tie';
  }

  const winsAgainst = {
    rock:     'scissors',
    paper:    'rock',
    scissors: 'paper',
  };

  if (winsAgainst[playerChoice] === computerChoice) {
    return 'Player Wins';
  }

  return 'Computer Wins';
}


// ── Restart ────────────────────────────────────────────────────────────────────
btnRestart.addEventListener('click', () => {
  // Reset scores
  playerScore   = 0;
  computerScore = 0;

  // Clear the scoreboard display
  playerScoreDisplay.textContent   = 0;
  computerScoreDisplay.textContent = 0;

  // Clear choices and result back to their initial placeholders
  playerChoiceDisplay.textContent   = '—';
  computerChoiceDisplay.textContent = '—';
  roundResultDisplay.textContent    = 'Make your move!';

  // Re-enable the choice buttons
  btnRock.disabled     = false;
  btnPaper.disabled    = false;
  btnScissors.disabled = false;
});
