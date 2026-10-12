import { guestTest } from '../../../fixture/web.fixture.js';
import { BasePage } from '../../../pageobjects/BasePage.js';
const { generateSignupData } = require('../../../testdata/dataSetGenerator.js');

guestTest('should open Create new account form with all signup fields', { tag: ['@smoke', '@regression', '@TC005'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Login.navigateToCreateNewAccount();
  await basePage.Signup.verifyCreateAccountFormHasAllFields();
});

guestTest('should fill the signup form and return to login without submitting', { tag: ['@regression', '@TC006'] }, async ({ page }) => {
  const basePage = new BasePage(page);
  const { signup } = generateSignupData(true);

  await basePage.Login.navigateToCreateNewAccount();
  await basePage.Signup.fillSignupFormWithoutSubmitting(signup);
  await basePage.Signup.returnToLoginFromSignup();
  await basePage.Login.verifyLoginPageIsReady();
});
