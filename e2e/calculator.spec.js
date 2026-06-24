import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/calculator.html`);
});

function display(page) {
    return page.locator('#display');
}

test('ввод чисел отображается на дисплее', async ({ page }) => {
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '3' }).click();

    await expect(display(page)).toHaveText('123');
});

test('сложение через кнопки показывает правильный результат', async ({ page }) => {
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '7' }).click();
    await page.getByRole('button', { name: '=' }).click();

    await expect(display(page)).toHaveText('19');
});

test('приоритет операций сохраняется (2+3*4=14)', async ({ page }) => {
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '×' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: '=' }).click();

    await expect(display(page)).toHaveText('14');
});

test('десятичные числа считаются корректно (1.5+2.5=4)', async ({ page }) => {
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '.' }).click();
    await page.getByRole('button', { name: '5' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '.' }).click();
    await page.getByRole('button', { name: '5' }).click();
    await page.getByRole('button', { name: '=' }).click();

    await expect(display(page)).toHaveText('4');
});

test('кнопка C очищает дисплей до 0', async ({ page }) => {
    await page.getByRole('button', { name: '9' }).click();
    await page.getByRole('button', { name: 'C' }).click();

    await expect(display(page)).toHaveText('0');
});

test('кнопка ⌫ удаляет последний символ', async ({ page }) => {
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '⌫' }).click();

    await expect(display(page)).toHaveText('12');
});

test('деление на ноль показывает Ошибка и следующий ввод сбрасывает дисплей', async ({ page }) => {
    await page.getByRole('button', { name: '8' }).click();
    await page.getByRole('button', { name: '/' }).click();
    await page.getByRole('button', { name: '0' }).click();
    await page.getByRole('button', { name: '=' }).click();

    await expect(display(page)).toHaveText('Ошибка');

    await page.getByRole('button', { name: '5' }).click();
    await expect(display(page)).toHaveText('5');
});

test('ввод с клавиатуры работает (12+3 Enter = 15)', async ({ page }) => {
    await page.keyboard.type('12+3');
    await page.keyboard.press('Enter');

    await expect(display(page)).toHaveText('15');
});
