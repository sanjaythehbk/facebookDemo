import { expect } from '@playwright/test';
import { log } from 'node:console';
const { UIHelper } = require('../../utils/uiHelper');
import { ForgotPasswordPageLocators } from '../locators/ForgotPasswordPageLocators';

export class ForgotPasswordPage {
  constructor(page) {
    this.page = page;
    this.ui = new UIHelper(page);
    this.locators = new ForgotPasswordPageLocators(page);
  }

  // Action Methods
  async fillIdentifyEmail(email) {
    await this.ui.fill(this.locators.identifyEmailInput, email);
  }

  async clickContinue() {
    await this.ui.click(this.locators.continueBtn);
  }

  async clickBack() {
    await this.ui.click(this.locators.backBtn);
  }

  // Verification Methods
  async verifyFindYourAccountPage() {
    await expect(this.page).toHaveURL(/recover\/initiate|login\/identify/);
    await expect(this.locators.findYourAccountHeading).toBeVisible();
    await expect(this.locators.identifyEmailInput).toBeVisible();
    await expect(this.locators.continueBtn).toBeVisible();
  }

  // Business Methods
  async verifyForgotPasswordPageLoaded() {
    log('Verifying Find your account page');
    await this.verifyFindYourAccountPage();
  }

  async continueWithEmail(email) {
    log(`Continuing account recovery for ${email}`);
    await this.fillIdentifyEmail(email);
    await this.clickContinue();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { ForgotPasswordPage };
