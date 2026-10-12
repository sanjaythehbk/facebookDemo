import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/Home/HomePage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { log } from "node:console";

export class BasePage {
  constructor(page) {
    this.page = page;

    // Initialize all page objects
    this.loginPage = new LoginPage(page);
    this.signupPage = new SignupPage(page);
    this.forgotPasswordPage = new ForgotPasswordPage(page);
    this.homePage = new HomePage(page);
    this.profilePage = new ProfilePage(page);
  }

  // Getters for easy access
  get Login() {
    return this.loginPage;
  }

  get Signup() {
    return this.signupPage;
  }

  get ForgotPassword() {
    return this.forgotPasswordPage;
  }

  get Home() {
    return this.homePage;
  }

  get Profile() {
    return this.profilePage;
  }

  // Common utility methods
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}-${Date.now()}.png` });
  }

  async logAction(action, details = {}) {
    log(`[${new Date().toISOString()}] ${action}`, details);
  }
}
