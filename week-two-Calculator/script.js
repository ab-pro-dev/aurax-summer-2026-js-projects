const expressionDisplay = document.querySelector('#expression');
const resultDisplay     = document.querySelector('#result');

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

const operatorButtons = document.querySelectorAll('.btn-operator');

const btnAdd      = document.querySelector('#btn-add');
const btnSubtract = document.querySelector('#btn-subtract');
const btnMultiply = document.querySelector('#btn-multiply');
const btnDivide   = document.querySelector('#btn-divide');

const btnClear  = document.querySelector('#btn-clear');
const btnEquals = document.querySelector('#btn-equals');

let currentInput   = '0';
let firstOperand   = null;
let operator       = null;
let expectNewInput = false;

function updateDisplay() {
  resultDisplay.textContent = currentInput;
}

function handleNumberInput(value) {
  if (expectNewInput) {
    currentInput   = value === '.' ? '0.' : value;
    expectNewInput = false;
    updateDisplay();
    return;
  }

  if (value === '.' && currentInput.includes('.')) return;

  if (currentInput === '0' && value !== '.') {
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

const operatorMap = { '÷': '/', '×': '*', '−': '-', '+': '+' };

function handleOperatorInput(symbol) {
  const op = operatorMap[symbol];
  if (!op) return;

  if (operator && expectNewInput) {
    operator = op;
    expressionDisplay.textContent = `${firstOperand} ${symbol}`;
    return;
  }

  if (firstOperand !== null && !expectNewInput) {
    calculate();
  }

  firstOperand   = parseFloat(currentInput);
  operator       = op;
  expectNewInput = true;

  expressionDisplay.textContent = `${firstOperand} ${symbol}`;
}

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleOperatorInput(button.textContent.trim());
  });
});

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
        operator       = null;
        firstOperand   = null;
        expectNewInput = true;
        updateDisplay();
        return;
      }
      result = firstOperand / secondOperand;
      break;
  }

  result = parseFloat(result.toPrecision(12));

  expressionDisplay.textContent = `${firstOperand} ${getOperatorSymbol(operator)} ${secondOperand} =`;
  currentInput   = String(result);
  firstOperand   = null;
  operator       = null;
  expectNewInput = true;

  updateDisplay();
}

function getOperatorSymbol(op) {
  return { '/': '÷', '*': '×', '-': '−', '+': '+' }[op] ?? op;
}

btnEquals.addEventListener('click', calculate);

function clearCalculator() {
  currentInput   = '0';
  firstOperand   = null;
  operator       = null;
  expectNewInput = false;

  expressionDisplay.textContent = '';
  updateDisplay();
}

btnClear.addEventListener('click', clearCalculator);
