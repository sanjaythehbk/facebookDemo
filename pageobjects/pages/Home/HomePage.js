import { expect } from '@playwright/test';
import { log } from 'node:console';
const { UIHelper } = require('../../../utils/uiHelper');
import { HomePageLocators } from '../../locators/HomePageLocators';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.ui = new UIHelper(page);
    this.locators = new HomePageLocators(page);
  }

  // Action Methods
  async clickFacebookLogo() {
    await this.ui.click(this.locators.facebookLogoLink);
  }

  async clickHomeNav() {
    await this.ui.click(this.locators.homeNavLink);
  }

  async openProfileMenu() {
    await this.ui.click(this.locators.profileMenuBtn);
  }

  async clickProfileNameInMenu() {
    await this.locators.profileMenuNameLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.ui.click(this.locators.profileMenuNameLink);
  }

  async fillSearch(query) {
    await this.ui.click(this.locators.searchInput);
    await this.ui.fill(this.locators.searchInput, query);
  }

  // Verification Methods
  async verifyHomeFeedLoaded() {
    await expect(this.locators.profileMenuBtn).toBeVisible({ timeout: 30000 });
    await expect(this.locators.searchInput).toBeVisible();
  }

  async verifyNavigationIcons() {
    await expect(this.locators.homeNavLink).toBeVisible();
    await expect(this.locators.friendsNavLink).toBeVisible();
  }

  async verifyPostComposerVisible() {
    await expect(this.locators.postComposer).toBeVisible();
  }

  // Business Methods
  async verifyHomePageElements() {
    log('Verifying home page elements');
    await this.verifyHomeFeedLoaded();
    await this.verifyNavigationIcons();
    await this.verifyPostComposerVisible();
  }

  async navigateToProfile() {
    log('Navigating to profile');
    await this.openProfileMenu();
    await this.clickProfileNameInMenu();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchFor(query) {
    log(`Searching for "${query}"`);
    await this.fillSearch(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { HomePage };
