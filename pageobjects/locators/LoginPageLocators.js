export class LoginPageLocators {
  constructor(page) {
    this.page = page;

    // Cookie consent (EU regions)
    this.declineOptionalCookiesBtn = page.getByRole('button', { name: /Decline optional cookies/i });
    this.allowAllCookiesBtn = page.getByRole('button', { name: /Allow all cookies/i });

    // Login form. Facebook serves two designs: the redesigned page (role/name only)
    // and the classic page (#email / #pass). Each locator covers both via .or().
    this.emailInput = page
      .getByRole('textbox', { name: /Email address or mobile number|Email or phone|Email address or phone number/i })
      .or(page.locator('#email'));
    this.passwordInput = page
      .getByRole('textbox', { name: /^Password$/i })
      .or(page.locator('#pass'));
    this.loginBtn = page
      .getByRole('button', { name: /^Log ?in$/i })
      .or(page.locator('button[name="login"]'));
    this.forgotPasswordLink = page.getByRole('link', { name: /Forgot(ten)? password\?/i });
    this.createNewAccountLink = page
      .getByRole('link', { name: /Create new account/i })
      .or(page.getByRole('button', { name: /Create new account/i }));
    this.loginHeading = page.getByText(/Log in to Facebook|Log into Facebook/i).first();

    // Invalid login feedback
    this.errorBox = page.locator('#error_box, div[role="alert"]').first();
    this.wrongCredentialsText = page.getByText(/incorrect|isn.t connected|couldn.t find|invalid|try again/i).first();

    // Logged-in account menu (used by logout)
    this.profileMenuBtn = page.locator('[aria-label="Your profile"], [aria-label="Account"]').first();
    this.logoutOption = page.getByText(/^Log out$/i).first();
    this.logoutConfirmBtn = page.getByRole('dialog').getByRole('button', { name: /^Log out$/i });
  }
}

module.exports = { LoginPageLocators };
