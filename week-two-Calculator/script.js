// ── Display ──────────────────────────────────────────────────────────────────
const expressionDisplay = document.querySelector('#expression');
const resultDisplay     = document.querySelector('#result');

// ── Number buttons ────────────────────────────────────────────────────────────
const numberButtons = document.querySelectorAll('.btn-number');

const btn0       = document.querySelector('#btn-0');
const btn1       = document.querySelector('#btn-1');
const btn2       = document.querySelector('#btn-2');
const btn3       = document.querySelector('#btn-3');
const btn4       = document.querySelector('#btn-4');
const btn5       = document.querySelector('#btn-5');
const btn6       = document.querySelector('#btn-6');
const btn7       = document.querySelector('#btn-7');
const btn8       = document.querySelector('#btn-8');
const btn9       = document.querySelector('#btn-9');
const btnDecimal = document.querySelector('#btn-decimal');

// ── Operator buttons ──────────────────────────────────────────────────────────
const operatorButtons = document.querySelectorAll('.btn-operator');

const btnAdd      = document.querySelector('#btn-add');
const btnSubtract = document.querySelector('#btn-subtract');
const btnMultiply = document.querySelector('#btn-multiply');
const btnDivide   = document.querySelector('#btn-divide');

// ── Utility buttons ───────────────────────────────────────────────────────────
const btnClear  = document.querySelector('#btn-clear');
const btnEquals = document.querySelector('#btn-equals');

// ── State ─────────────────────────────────────────────────────────────────────
let currentInput = '0';

// ── Helpers ───────────────────────────────────────────────────────────────────
function updateDisplay() {
  resultDisplay.textContent = currentInput;
}

// ── Number & decimal input ────────────────────────────────────────────────────
function handleNumberInput(value) {
  // Prevent more than one decimal point
  if (value === '.' && currentInput.includes('.')) return;

  if (currentInput === '0' && value !== '.') {
    // Replace the leading zero with the new digit
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleNumberInput(button.textContent);
  });
});
