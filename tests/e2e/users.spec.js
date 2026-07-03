import { test, expect } from '@playwright/test';

test('opens users page', async ({ page }) => {
    await page.goto('/anvandare');

    await expect(page).toHaveURL(/anvandare/);

    await expect(
        page.getByRole('heading', {
            name: /användare/i
        })
    ).toBeVisible();
});

test('creates empty user form', async ({ page }) => {
    await page.goto('/anvandare');

    await page
        .getByRole('button', {
            name: 'Ny'
        })
        .click();

    await expect(page.getByLabel('E-post')).toHaveValue('');
});
