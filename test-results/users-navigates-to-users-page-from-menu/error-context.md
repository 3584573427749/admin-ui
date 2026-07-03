# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: users.spec.js >> navigates to users page from menu
- Location: tests\e2e\users.spec.js:15:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Användare' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - img "Simning.ax" [ref=e5]
    - navigation [ref=e6]:
      - button "Hem" [ref=e8] [cursor=pointer]
      - generic [ref=e9]:
        - button "Användare ▼" [active] [ref=e10] [cursor=pointer]:
          - text: Användare
          - generic [ref=e11]: ▼
        - generic [ref=e12]:
          - button "Användare" [ref=e13] [cursor=pointer]
          - button "Roller" [ref=e14] [cursor=pointer]
          - button "Rättigheter" [ref=e15] [cursor=pointer]
      - button "Grupper ▼" [ref=e17] [cursor=pointer]:
        - text: Grupper
        - generic [ref=e18]: ▼
      - button "Tidsredovisningar ▼" [ref=e20] [cursor=pointer]:
        - text: Tidsredovisningar
        - generic [ref=e21]: ▼
      - button "Om" [ref=e23] [cursor=pointer]
  - main [ref=e25]:
    - heading "Vue Web-UI Template" [level=1] [ref=e26]
    - paragraph [ref=e27]: Mallen är korrekt installerad.
    - button "Test" [ref=e28] [cursor=pointer]:
      - generic [ref=e29]: Test
  - contentinfo [ref=e30]:
    - generic [ref=e31]: © Kjell Hansen 2026
    - generic [ref=e32]: "version: 0.1.0"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('opens users page', async ({ page }) => {
  4  |     await page.goto('/anvandare');
  5  | 
  6  |     await expect(page).toHaveURL(/anvandare/);
  7  | 
  8  |     await expect(
  9  |         page.getByRole('heading', {
  10 |             name: /användare/i
  11 |         })
  12 |     ).toBeVisible();
  13 | });
  14 | 
  15 | test('navigates to users page from menu', async ({ page }) => {
  16 |     await page.goto('/');
  17 | 
  18 |     await page.getByText('Användare').first().click();
  19 | 
  20 |     await page
  21 |         .getByRole('link', {
  22 |             name: 'Användare'
  23 |         })
> 24 |         .click();
     |          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  25 | 
  26 |     await expect(page).toHaveURL(/anvandare/);
  27 | });
  28 | 
  29 | 
  30 | test('creates empty user form', async ({ page }) => {
  31 |     await page.goto('/anvandare');
  32 | 
  33 |     await page
  34 |         .getByRole('button', {
  35 |             name: 'Ny'
  36 |         })
  37 |         .click();
  38 | 
  39 |     await expect(page.getByLabel('E-post')).toHaveValue('');
  40 | });
  41 | test('creates user', async ({ page }) => {
  42 |     page.on('console', (msg) => {
  43 |         console.log('Browser:', msg.text());
  44 |     });
  45 |     await page.goto('/anvandare');
  46 | 
  47 |     await page
  48 |         .getByRole('button', {
  49 |             name: 'Ny'
  50 |         })
  51 |         .click();
  52 | 
  53 |     await page.getByLabel('E-post').fill(`anna-${Date.now()}@example.com`);
  54 | 
  55 |     await page.getByLabel('Förnamn').fill('Anna');
  56 | 
  57 |     await page.getByLabel('Efternamn').fill('Andersson');
  58 | 
  59 |     await page
  60 |         .getByRole('button', {
  61 |             name: 'Spara'
  62 |         })
  63 |         .click();
  64 | 
  65 |     await expect(page.locator('.toast__message')).toBeVisible();
  66 |     await expect(page.getByText('Användaren skapades.')).toBeVisible();
  67 | });
  68 | 
```