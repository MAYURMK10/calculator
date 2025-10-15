const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

let currentInput = '';

const operators = ['+', '-', '×', '÷', '*', '/', '%'];

function sanitizeForEval(input) {
  // convert × and ÷ to JS operators
  let expr = input.replace(/×/g, '*').replace(/÷/g, '/');

  // convert occurrences like 50% into (50/100)
  // handles decimals too e.g. 12.5%
  expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

  // remove any trailing operator characters (so "2*3+" becomes "2*3")
  while (/[+\-*/]$/.test(expr)) {
    expr = expr.slice(0, -1);
  }

  return expr;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === 'C') {
      currentInput = '';
      display.textContent = '0';
    } 
    else if (value === 'D') {
      currentInput = currentInput.slice(0, -1);
      display.textContent = currentInput || '0';
    } 
    else if (value === '=') {
      try {
        if (!currentInput) {
          display.textContent = '0';
          return;
        }

        const expr = sanitizeForEval(currentInput);

        // If nothing left after sanitizing, show 0
        if (!expr) {
          display.textContent = '0';
          currentInput = '';
          return;
        }

        const result = eval(expr);

        // handle bad results
        if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
          display.textContent = 'Error';
          currentInput = '';
        } else {
          // trim long decimals sensibly
          const formatted = Number.isFinite(result) && !Number.isInteger(result)
            ? parseFloat(result.toFixed(12)).toString()
            : result.toString();

          display.textContent = formatted;
          currentInput = formatted;
        }
      } catch (e) {
        display.textContent = 'Error';
        currentInput = '';
      }
    } 
    else {
      // handle operator consecutiveness:
      const lastChar = currentInput.slice(-1);

      // if new value is operator and lastChar is operator, replace last operator
      if (operators.includes(value) && operators.includes(lastChar)) {
        // allow minus after another operator only if it's part of a negative number? (simple approach: replace)
        currentInput = currentInput.slice(0, -1) + value;
      } else {
        currentInput += value;
      }

      display.textContent = currentInput || '0';
      // auto-scroll display to show the latest characters
      display.scrollLeft = display.scrollWidth;
    }
  });
});
