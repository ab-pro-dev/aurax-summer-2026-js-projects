// ── Button Elements ────────────────────────────────────────────────────────────
const btnRock     = document.querySelector('#btn-rock');
const btnPaper    = document.querySelector('#btn-paper');
const btnScissors = document.querySelector('#btn-scissors');
const btnRestart  = document.querySelector('#btn-restart');

// Convenience array — lets us loop over the choice buttons instead of repeating code.
const choiceButtons = [btnRock, btnPaper, btnScissors];


// ── Result Display Elements ────────────────────────────────────────────────────
const playerChoiceDisplay   = document.querySelector('#player-choice-display');
const computerChoiceDisplay = document.querySelector('#computer-choice-display');
const roundResultDisplay    = document.querySelector('#round-result-display');


// ── Scoreboard Elements ────────────────────────────────────────────────────────
const playerScoreDisplay   = document.querySelector('#player-score-display');
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
// Enables or disables all choice buttons in one go.
function setButtonsDisabled(disabled) {
  choiceButtons.forEach(btn => btn.disabled = disabled);
}

function endGame() {
  roundResultDisplay.textContent = playerScore === 5 ? '🎉 You Win!' : '💻 Computer Wins!';
  setButtonsDisabled(true);
}

// ── Player Choice Detection ────────────────────────────────────────────────────
// Each button stores its choice in a data-choice attribute — see HTML ids.
// Loop over the array instead of writing three identical listeners.
choiceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Extract the choice from the button's id: "btn-rock" → "rock"
    const choice = btn.id.replace('btn-', '');
    updateDisplay(choice);
  });
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
  setButtonsDisabled(false);
});
