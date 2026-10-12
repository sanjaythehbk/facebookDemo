import { expect } from '@playwright/test';
import { log } from 'node:console';
const { UIHelper } = require('../../utils/uiHelper');
import { LoginPageLocators } from '../locators/LoginPageLocators';
import { waitForFormLoad } from '../../utils/wait.util.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.ui = new UIHelper(page);
    this.locators = new LoginPageLocators(page);
  }

  // Action Methods
  async dismissCookieBannerIfVisible() {
    try {
      await this.locators.declineOptionalCookiesBtn.waitFor({ state: 'visible', timeout: 5000 });
      await this.locators.declineOptionalCookiesBtn.click();
    } catch {
      // banner did not appear - continue
    }
  }

  async fillEmail(email) {
    await this.ui.fill(this.locators.emailInput, email);
  }

  async fillPassword(password) {
    await this.ui.fill(this.locators.passwordInput, password);
  }

  async clearCredentials() {
    await this.ui.fill(this.locators.emailInput, '');
    await this.ui.fill(this.locators.passwordInput, '');
  }

  async clickLogin() {
    await this.ui.click(this.locators.loginBtn);
  }

  async clickForgotPassword() {
    await this.ui.click(this.locators.forgotPasswordLink);
  }

  async clickCreateNewAccount() {
    await this.ui.click(this.locators.createNewAccountLink);
  }

  async openProfileMenu() {
    await this.ui.click(this.locators.profileMenuBtn);
  }

  async clickLogoutOption() {
    await this.locators.logoutOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.ui.click(this.locators.logoutOption);
  }

  async confirmLogoutIfPrompted() {
    try {
      await this.locators.logoutConfirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await this.locators.logoutConfirmBtn.click();
    } catch {
      // no confirmation dialog - already logged out
    }
  }

  // Verification Methods
  async verifyLoginPageElements() {
    await expect(this.locators.emailInput).toBeVisible();
    await expect(this.locators.passwordInput).toBeVisible();
    await expect(this.locators.loginBtn).toBeVisible();
    await expect(this.locators.forgotPasswordLink).toBeVisible();
    await expect(this.locators.createNewAccountLink).toBeVisible();
  }

  async verifyLoginSuccess() {
    await expect(this.locators.profileMenuBtn).toBeVisible({ timeout: 30000 });
  }

  async verifyStillOnLoginPage() {
    await expect(this.locators.emailInput).toBeVisible();
    await expect(this.page).toHaveURL(/facebook\.com/);
  }

  /**
   * TODO(human): Implement this verification.
   *
   * Called right after an invalid login attempt. Facebook responds in one of several ways
   * depending on design, locale and account state: an inline error under the inputs, a
   * redirect to /login/?... with an #error_box, or a "Find your account" style recovery prompt.
   *
   * Available locators: this.locators.errorBox, this.locators.wrongCredentialsText,
   * this.locators.emailInput, and this.page (for URL checks).
   *
   * Decide what "invalid login was rejected" means for this suite and assert it here.
   */
  async verifyInvalidLoginError() {
    // Your implementation here
  }

  // Business Methods
  async login(email, password) {
    log(`Logging in as ${email}`);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginAndVerify(email, password) {
    await this.login(email, password);
    await this.verifyLoginSuccess();
  }

  async verifyLoginPageIsReady() {
    log('Verifying login page elements');
    await this.verifyLoginPageElements();
  }

  async attemptLoginWithInvalidCredentialsAndVerifyError(email, password) {
    log(`Attempting invalid login as ${email}`);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await waitForFormLoad(this.page);
    await this.verifyInvalidLoginError();
  }

  async attemptLoginWithEmptyCredentialsAndVerify() {
    log('Attempting login with empty credentials');
    await this.clearCredentials();
    await this.clickLogin();
    await waitForFormLoad(this.page);
    await this.verifyStillOnLoginPage();
  }

  async navigateToForgotPassword() {
    log('Navigating to Forgot password');
    await this.clickForgotPassword();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToCreateNewAccount() {
    log('Navigating to Create new account');
    await this.clickCreateNewAccount();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout() {
    log('Logging out');
    await this.openProfileMenu();
    await this.clickLogoutOption();
    await this.confirmLogoutIfPrompted();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logoutAndVerify() {
    await this.logout();
    await this.verifyStillOnLoginPage();
  }
}

module.exports = { LoginPage };
