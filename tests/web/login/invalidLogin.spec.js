import { guestTest } from '../../../fixture/web.fixture.js';
import { BasePage } from '../../../pageobjects/BasePage.js';
const { getExistingModuleData } = require('../../../testdata/dataSetGenerator.js');

const { login } = getExistingModuleData('login');

guestTest('should show an error and stay on login page for an invalid password', { tag: ['@regression', '@TC003'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Login.attemptLoginWithInvalidCredentialsAndVerifyError(login.invalidEmail, login.invalidPassword);
});

guestTest('should stay on login page when email and password are empty', { tag: ['@regression', '@TC004'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Login.attemptLoginWithEmptyCredentialsAndVerify();
});
