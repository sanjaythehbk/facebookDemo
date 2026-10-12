import { guestTest } from '../../../fixture/web.fixture.js';
import { BasePage } from '../../../pageobjects/BasePage.js';

guestTest('should navigate to Find your account page from Forgot password', { tag: ['@smoke', '@regression', '@TC007'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Login.navigateToForgotPassword();
  await basePage.ForgotPassword.verifyForgotPasswordPageLoaded();
});
