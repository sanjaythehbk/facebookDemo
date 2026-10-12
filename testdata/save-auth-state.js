// Logs in once and saves cookies/localStorage to testdata/auth.json (gitignored).
// Reuse it as storageState to avoid Facebook login checkpoints on repeated runs.
//   npm run auth:save        -> stage config
//   npm run auth:save:dev    -> dev config
const { chromium } = require('@playwright/test');
const path = require('path');
const { loadEnv } = require('../utils/env.util.js');
const { LoginPage } = require('../pageobjects/pages/LoginPage');

(async () => {
  loadEnv();

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();

  await page.goto(process.env.BASE_URL);

  const loginPage = new LoginPage(page);
  await loginPage.dismissCookieBannerIfVisible();
  await loginPage.loginAndVerify(process.env.email, process.env.PASSWORD);

  const outPath = path.join(__dirname, 'auth.json');
  await context.storageState({ path: outPath });
  console.log(`Auth state saved to ${outPath}`);

  await browser.close();
})().catch((err) => {
  console.error('Failed to save auth state:', err.message);
  process.exit(1);
});
