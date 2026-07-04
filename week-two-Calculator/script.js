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
let currentInput  = '0';  // number being typed right now
let firstOperand  = null; // stored first number
let operator      = null; // pending operator (+, -, *, /)
let expectNewInput = false; // true after an operator is chosen

// ── Helpers ───────────────────────────────────────────────────────────────────
function updateDisplay() {
  resultDisplay.textContent = currentInput;
}

// ── Number & decimal input ────────────────────────────────────────────────────
function handleNumberInput(value) {
  // After pressing = or an operator, start a fresh number
  if (expectNewInput) {
    currentInput   = value === '.' ? '0.' : value;
    expectNewInput = false;
    updateDisplay();
    return;
  }

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

// ── Operator buttons ──────────────────────────────────────────────────────────
// Maps button text to arithmetic operators
const operatorMap = { '÷': '/', '×': '*', '−': '-', '+': '+' };

function handleOperatorInput(symbol) {
  const op = operatorMap[symbol];
  if (!op) return;

  // If there's a pending operation and the user hasn't started a new number,
  // just swap the operator
  if (operator && expectNewInput) {
    operator = op;
    expressionDisplay.textContent = `${firstOperand} ${symbol}`;
    return;
  }

  // If we already have a first operand and a new number, chain the calculation
  if (firstOperand !== null && !expectNewInput) {
    calculate();
  }

  firstOperand  = parseFloat(currentInput);
  operator      = op;
  expectNewInput = true;

  expressionDisplay.textContent = `${firstOperand} ${symbol}`;
}

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleOperatorInput(button.textContent.trim());
  });
});

// ── Calculate ─────────────────────────────────────────────────────────────────
function calculate() {
  if (operator === null || firstOperand === null) return;

  const secondOperand = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+': result = firstOperand + secondOperand; break;
    case '-': result = firstOperand - secondOperand; break;
    case '*': result = firstOperand * secondOperand; break;
    case '/':
      if (secondOperand === 0) {
        currentInput = 'Error';
        expressionDisplay.textContent = '';
        operator      = null;
        firstOperand  = null;
        expectNewInput = true;
        updateDisplay();
        return;
      }
      result = firstOperand / secondOperand;
      break;
  }

  // Avoid floating-point noise (e.g. 0.1 + 0.2 = 0.30000000000000004)
  result = parseFloat(result.toPrecision(12));

  expressionDisplay.textContent = `${firstOperand} ${getOperatorSymbol(operator)} ${secondOperand} =`;
  currentInput  = String(result);
  firstOperand  = null;
  operator      = null;
  expectNewInput = true;

  updateDisplay();
}

// Returns the display symbol for a stored operator character
function getOperatorSymbol(op) {
  return { '/': '÷', '*': '×', '-': '−', '+': '+' }[op] ?? op;
}

btnEquals.addEventListener('click', calculate);

// ── Clear ─────────────────────────────────────────────────────────────────────
function clearCalculator() {
  currentInput   = '0';
  firstOperand   = null;
  operator       = null;
  expectNewInput = false;

  expressionDisplay.textContent = '';
  updateDisplay();
}

btnClear.addEventListener('click', clearCalculator);
