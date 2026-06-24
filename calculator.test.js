import { describe, expect, it } from 'vitest';
import { Calculator } from './calculator.js';

describe('Calculator', () => {
    it('constructor initializes default display value', () => {
        const calculator = new Calculator();

        expect(calculator.getDisplayValue()).toBe('0');
        expect(calculator.shouldResetDisplay).toBe(false);
    });

    it('constructor accepts custom initial value', () => {
        const calculator = new Calculator('42');

        expect(calculator.getDisplayValue()).toBe('42');
    });

    it('appendNumber replaces zero with first digit', () => {
        const calculator = new Calculator();

        const result = calculator.appendNumber('7');

        expect(result).toBe('7');
        expect(calculator.getDisplayValue()).toBe('7');
    });

    it('appendNumber appends digit to existing value', () => {
        const calculator = new Calculator('12');

        const result = calculator.appendNumber('3');

        expect(result).toBe('123');
    });

    it('appendNumber resets display after previous calculation', () => {
        const calculator = new Calculator('25');
        calculator.shouldResetDisplay = true;

        const result = calculator.appendNumber('8');

        expect(result).toBe('8');
        expect(calculator.shouldResetDisplay).toBe(false);
    });

    it('appendDecimal adds decimal point to integer', () => {
        const calculator = new Calculator('12');

        const result = calculator.appendDecimal();

        expect(result).toBe('12.');
    });

    it('appendDecimal does not add second decimal point to the same number', () => {
        const calculator = new Calculator('12.5');

        const result = calculator.appendDecimal();

        expect(result).toBe('12.5');
    });

    it('appendDecimal allows decimal point in the next operand', () => {
        const calculator = new Calculator('1.5+2');

        const result = calculator.appendDecimal();

        expect(result).toBe('1.5+2.');
    });

    it('appendDecimal starts new fractional number after reset flag', () => {
        const calculator = new Calculator('15');
        calculator.shouldResetDisplay = true;

        const result = calculator.appendDecimal();

        expect(result).toBe('0.');
        expect(calculator.shouldResetDisplay).toBe(false);
    });

    it('appendOperator adds operator to expression', () => {
        const calculator = new Calculator('12');

        const result = calculator.appendOperator('+');

        expect(result).toBe('12+');
    });

    it('appendOperator replaces previous operator', () => {
        const calculator = new Calculator('12+');

        const result = calculator.appendOperator('*');

        expect(result).toBe('12*');
    });

    it('appendOperator keeps expression and clears reset flag after calculation', () => {
        const calculator = new Calculator('8');
        calculator.shouldResetDisplay = true;

        const result = calculator.appendOperator('-');

        expect(result).toBe('8-');
        expect(calculator.shouldResetDisplay).toBe(false);
    });

    it('calculate evaluates valid expression', () => {
        const calculator = new Calculator('2+3*4');

        const result = calculator.calculate();

        expect(result).toBe('14');
        expect(calculator.shouldResetDisplay).toBe(true);
    });

    it('calculate supports multiplication symbol from UI', () => {
        const calculator = new Calculator('6×7');

        const result = calculator.calculate();

        expect(result).toBe('42');
    });

    it('calculate returns error for division by zero', () => {
        const calculator = new Calculator('8/0');

        const result = calculator.calculate();

        expect(result).toBe('Ошибка');
        expect(calculator.shouldResetDisplay).toBe(true);
    });

    it('calculate returns error for invalid expression', () => {
        const calculator = new Calculator('5+');

        const result = calculator.calculate();

        expect(result).toBe('Ошибка');
        expect(calculator.shouldResetDisplay).toBe(true);
    });

    it('calculate returns error for non-finite result', () => {
        const calculator = new Calculator('0/0.0');

        const result = calculator.calculate();

        expect(result).toBe('Ошибка');
    });

    it('clearDisplay resets input and reset flag', () => {
        const calculator = new Calculator('123');
        calculator.shouldResetDisplay = true;

        const result = calculator.clearDisplay();

        expect(result).toBe('0');
        expect(calculator.getDisplayValue()).toBe('0');
        expect(calculator.shouldResetDisplay).toBe(false);
    });

    it('deleteLast removes last character from multi-character input', () => {
        const calculator = new Calculator('123');

        const result = calculator.deleteLast();

        expect(result).toBe('12');
    });

    it('deleteLast resets to zero for single character input', () => {
        const calculator = new Calculator('9');

        const result = calculator.deleteLast();

        expect(result).toBe('0');
    });

    it('deleteLast clears display when reset flag is active', () => {
        const calculator = new Calculator('88');
        calculator.shouldResetDisplay = true;

        const result = calculator.deleteLast();

        expect(result).toBe('0');
        expect(calculator.shouldResetDisplay).toBe(false);
    });
});
