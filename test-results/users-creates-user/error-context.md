# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: users.spec.js >> creates user
- Location: tests\e2e\users.spec.js:41:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.toast__message')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.toast__message')

```

```yaml
- banner:
  - img "Simning.ax"
  - navigation:
    - button "Hem"
    - button "Användare ▼"
    - button "Grupper ▼"
    - button "Tidsredovisningar ▼"
    - button "Om"
- heading "Användare" [level=3]
- list:
  - listitem: Kjell Hansen
  - listitem: Nizze Liten
  - listitem: Anna Andersson
- tablist:
  - tab "Information" [selected]
  - tab "Grupper"
  - tab "Övrigt"
- text: Förnamn
- textbox "Förnamn": Kjell
- text: Efternamn
- textbox "Efternamn": Hansen
- text: E-post
- textbox "E-post": kjell@kejpa.com
- heading "Roller" [level=4]
- checkbox "Verksamhetsledare"
- text: Verksamhetsledare
- checkbox "Ledare"
- text: Ledare
- checkbox "Styrelse"
- text: Styrelse
- checkbox "Domare"
- text: Domare
- button "Spara"
- button "Radera"
- button "Ny"
- contentinfo: "© Kjell Hansen 2026 version: 0.1.0"
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
  24 |         .click();
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
> 65 |     await expect(page.locator('.toast__message')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  66 |     await expect(page.getByText('Användaren skapades.')).toBeVisible();
  67 | });
  68 | 
```