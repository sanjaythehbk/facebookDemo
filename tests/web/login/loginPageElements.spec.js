import { guestTest } from '../../../fixture/web.fixture.js';
import { BasePage } from '../../../pageobjects/BasePage.js';

guestTest('should display email, password, Log in, Forgot password and Create new account', { tag: ['@smoke', '@regression', '@TC002'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Login.verifyLoginPageIsReady();
});
