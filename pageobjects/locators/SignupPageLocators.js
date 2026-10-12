export class SignupPageLocators {
  constructor(page) {
    this.page = page;

    // Current design: full page at /reg/ with role/name controls.
    // Classic design: modal dialog with name= attributes. Each locator covers both via .or().
    this.signupHeading = page.getByText(/Get started on Facebook|Create a new account|Sign Up/i).first();

    // Name
    this.firstNameInput = page
      .getByRole('textbox', { name: /First name/i })
      .or(page.locator('[name="firstname"]'));
    this.lastNameInput = page
      .getByRole('textbox', { name: /^Surname$|^Last name$/i })
      .or(page.locator('[name="lastname"]'));

    // Date of birth
    this.birthdayDaySelect = page
      .getByRole('combobox', { name: /Select day|^Day$/i })
      .or(page.locator('#day'));
    this.birthdayMonthSelect = page
      .getByRole('combobox', { name: /Select month|^Month$/i })
      .or(page.locator('#month'));
    this.birthdayYearSelect = page
      .getByRole('combobox', { name: /Select year|^Year$/i })
      .or(page.locator('#year'));

    // Gender
    this.genderSelect = page
      .getByRole('combobox').filter({ hasText: /Select your gender/i })
      .or(page.locator('input[name="sex"]').first());

    // Contact and password
    this.emailOrMobileInput = page
      .getByRole('textbox', { name: /Mobile number or email address/i })
      .or(page.locator('[name="reg_email__"]'));
    this.passwordInput = page
      .getByRole('textbox', { name: /^Password/i })
      .or(page.locator('[name="reg_passwd__"]'));

    // Actions
    this.submitBtn = page
      .getByRole('button', { name: /^(Submit|Sign Up)$/i })
      .or(page.locator('button[name="websubmit"]'));
    this.alreadyHaveAccountBtn = page
      .getByRole('button', { name: /I already have an account/i })
      .or(page.getByRole('dialog').locator('[aria-label="Close"], img[alt="Close"]').first());
  }
}

module.exports = { SignupPageLocators };
