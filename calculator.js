export class Calculator {
    constructor(initialInput = '0') {
        this.currentInput = initialInput;
        this.shouldResetDisplay = false;
    }

    getDisplayValue() {
        return this.currentInput;
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }

        if (this.currentInput === '0') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }

        return this.currentInput;
    }

    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }

        const lastPlus = this.currentInput.lastIndexOf('+');
        const lastMinus = this.currentInput.lastIndexOf('-');
        const lastMultiply = this.currentInput.lastIndexOf('*');
        const lastDivide = this.currentInput.lastIndexOf('/');
        const lastOperatorIndex = Math.max(lastPlus, lastMinus, lastMultiply, lastDivide);
        const currentNumber = this.currentInput.slice(lastOperatorIndex + 1);

        if (currentNumber.length === 0) {
            this.currentInput += '0.';
            return this.currentInput;
        }

        if (!currentNumber.includes('.')) {
            this.currentInput += '.';
        }

        return this.currentInput;
    }

    appendOperator(operator) {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
        }

        const lastChar = this.currentInput[this.currentInput.length - 1];
        if (['+', '-', '*', '/'].includes(lastChar)) {
            this.currentInput = this.currentInput.slice(0, -1) + operator;
        } else {
            this.currentInput += operator;
        }

        return this.currentInput;
    }

    calculate() {
        try {
            const expression = this.currentInput.replace(/×/g, '*');

            if (expression.includes('/0') && !expression.includes('/0.')) {
                this.currentInput = 'Ошибка';
                this.shouldResetDisplay = true;
                return this.currentInput;
            }

            const result = Function('"use strict"; return (' + expression + ')')();

            if (Number.isNaN(result) || !Number.isFinite(result)) {
                this.currentInput = 'Ошибка';
            } else {
                this.currentInput = result.toString();
            }

            this.shouldResetDisplay = true;
            return this.currentInput;
        } catch (error) {
            this.currentInput = 'Ошибка';
            this.shouldResetDisplay = true;
            return this.currentInput;
        }
    }

    clearDisplay() {
        this.currentInput = '0';
        this.shouldResetDisplay = false;
        return this.currentInput;
    }

    deleteLast() {
        if (this.shouldResetDisplay) {
            return this.clearDisplay();
        }

        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }

        return this.currentInput;
    }
}
