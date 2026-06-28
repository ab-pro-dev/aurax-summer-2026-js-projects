//Button Elements 
const btnRock     = document.querySelector('#btn-rock');
const btnPaper    = document.querySelector('#btn-paper');
const btnScissors = document.querySelector('#btn-scissors');
const btnRestart  = document.querySelector('#btn-restart');


const choiceButtons = [btnRock, btnPaper, btnScissors];


// Result Display Elements
const playerChoiceDisplay   = document.querySelector('#player-choice-display');
const computerChoiceDisplay = document.querySelector('#computer-choice-display');
const roundResultDisplay    = document.querySelector('#round-result-display');


//Scoreboard Elements 
const playerScoreDisplay   = document.querySelector('#player-score-display');
const computerScoreDisplay = document.querySelector('#computer-score-display');


let playerScore   = 0;
let computerScore = 0;


// ── Computer Choice
function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

//Display Update
.
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function updateDisplay(choice) {
  const computerChoice = getComputerChoice();
  const result         = playRound(choice, computerChoice);

  // Update scores
  if (result === 'You Win')   playerScore++;
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

//Game Over 
function setButtonsDisabled(disabled) {
  choiceButtons.forEach(btn => btn.disabled = disabled);
}

function endGame() {
  roundResultDisplay.textContent = playerScore === 5 ? '🎉 You Win!' : '💻 Computer Wins!';
  setButtonsDisabled(true);
}

//Player Choice Detection 
choiceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Extract the choice from the button's id: "btn-rock" → "rock"
    const choice = btn.id.replace('btn-', '');
    updateDisplay(choice);
  });
});


//Round Logic
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
    return 'You Win';
  }

  return 'Computer Wins';
}


// Restart
btnRestart.addEventListener('click', () => {
  // Reset scores
  playerScore   = 0;
  computerScore = 0;

  //Clear the scoreboard display
  playerScoreDisplay.textContent   = 0;
  computerScoreDisplay.textContent = 0;

  //Clear choices 
  playerChoiceDisplay.textContent   = '—';
  computerChoiceDisplay.textContent = '—';
  roundResultDisplay.textContent    = 'Make your move!';

  // Re-enable the choice buttons
  setButtonsDisabled(false);
});
