export class ForgotPasswordPageLocators {
  constructor(page) {
    this.page = page;

    // Current design: /recover/initiate/ with a Continue button.
    // Classic design: /login/identify/ with #identify_email and a Search button.
    this.findYourAccountHeading = page.getByText(/Find your account/i).first();
    this.identifyEmailInput = page
      .getByRole('textbox', { name: /Mobile number or email address|Email address or mobile number/i })
      .or(page.locator('#identify_email'));
    this.continueBtn = page
      .getByRole('button', { name: /^(Continue|Search)$/i })
      .or(page.locator('#did_submit'));
    this.backBtn = page
      .getByRole('button', { name: /^Back$/i })
      .or(page.getByRole('link', { name: /^Cancel$/i }));
  }
}

module.exports = { ForgotPasswordPageLocators };
