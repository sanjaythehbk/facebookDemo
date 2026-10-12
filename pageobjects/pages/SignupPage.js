import { expect } from '@playwright/test';
import { log } from 'node:console';
const { UIHelper } = require('../../utils/uiHelper');
import { SignupPageLocators } from '../locators/SignupPageLocators';

export class SignupPage {
  constructor(page) {
    this.page = page;
    this.ui = new UIHelper(page);
    this.locators = new SignupPageLocators(page);
  }

  // Action Methods
  async fillFirstName(firstName) {
    await this.ui.fill(this.locators.firstNameInput, firstName);
  }

  async fillLastName(lastName) {
    await this.ui.fill(this.locators.lastNameInput, lastName);
  }

  async fillEmailOrMobile(value) {
    await this.ui.fill(this.locators.emailOrMobileInput, value);
  }

  async fillPassword(password) {
    await this.ui.fill(this.locators.passwordInput, password);
  }

  async selectBirthday({ day, month, year }) {
    await this.locators.birthdayDaySelect.selectOption(String(day));
    await this.locators.birthdayMonthSelect.selectOption({ index: Number(month) });
    await this.locators.birthdayYearSelect.selectOption(String(year));
  }

  async selectGender(index = 1) {
    await this.locators.genderSelect.selectOption({ index });
  }

  async clickAlreadyHaveAccount() {
    await this.ui.click(this.locators.alreadyHaveAccountBtn);
  }

  // Verification Methods
  async verifySignupHeadingVisible() {
    await expect(this.locators.signupHeading).toBeVisible();
  }

  async verifySignupFormFields() {
    await expect(this.locators.firstNameInput).toBeVisible();
    await expect(this.locators.lastNameInput).toBeVisible();
    await expect(this.locators.birthdayDaySelect).toBeVisible();
    await expect(this.locators.birthdayMonthSelect).toBeVisible();
    await expect(this.locators.birthdayYearSelect).toBeVisible();
    await expect(this.locators.genderSelect).toBeVisible();
    await expect(this.locators.emailOrMobileInput).toBeVisible();
    await expect(this.locators.passwordInput).toBeVisible();
    await expect(this.locators.submitBtn).toBeVisible();
  }

  async verifySignupFormClosed() {
    await expect(this.locators.firstNameInput).toBeHidden();
  }

  // Business Methods
  async verifyCreateAccountFormHasAllFields() {
    log('Verifying Create new account form fields');
    await this.verifySignupHeadingVisible();
    await this.verifySignupFormFields();
  }

  async fillSignupFormWithoutSubmitting(data) {
    log(`Filling signup form for ${data.firstName} ${data.lastName}`);
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.selectBirthday(data.birthday);
    await this.selectGender(data.genderIndex);
    await this.fillEmailOrMobile(data.emailOrMobile);
    await this.fillPassword(data.password);
  }

  async returnToLoginFromSignup() {
    log('Returning to login from signup');
    await this.clickAlreadyHaveAccount();
    await this.page.waitForLoadState('domcontentloaded');
    await this.verifySignupFormClosed();
  }
}

module.exports = { SignupPage };
