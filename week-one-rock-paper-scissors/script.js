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


// ── Computer Choice ────────────────────────────────────────────────────────────
// Returns one of three strings at random, simulating the computer's pick.
function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}
