import { test as base, expect } from '@playwright/test';
import { loadEnv } from '../utils/env.util.js';
import { LoginPage } from '../pageobjects/pages/LoginPage';
import fs from 'fs';

// Load environment variables
loadEnv();

// Load test data
let testData = {};
try {
  testData = JSON.parse(fs.readFileSync('testdata/testdata.json', 'utf8'));
} catch (error) {
  console.error('Error loading testdata.json:', error.message);
}

const openFacebook = async (browser) => {
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
    locale: 'en-US',
  });
  const page = await context.newPage();
  await page.goto(process.env.BASE_URL);

  const loginPage = new LoginPage(page);
  await loginPage.dismissCookieBannerIfVisible();

  return { context, page, loginPage };
};

// Logged-in session: use for home, profile, and logout tests
export const webTest = base.extend({
  page: async ({ browser }, use) => {
    const { context, page, loginPage } = await openFacebook(browser);
    const email = process.env.email;
    const password = process.env.PASSWORD;

    await loginPage.login(email, password);

    await use(page);

    await context.close();
  }
});

// Unauthenticated session: use for login page, signup, and forgot password tests
export const guestTest = base.extend({
  page: async ({ browser }, use) => {
    const { context, page } = await openFacebook(browser);

    await use(page);

    await context.close();
  }
});

export { expect };
