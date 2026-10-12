import { expect } from '@playwright/test';
import { log } from 'node:console';
const { UIHelper } = require('../../../utils/uiHelper');
import { ProfilePageLocators } from '../../locators/ProfilePageLocators';

export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.ui = new UIHelper(page);
    this.locators = new ProfilePageLocators(page);
  }

  // Action Methods
  async clickTab(tabName) {
    await this.ui.click(this.locators.tabByName(tabName));
  }

  // Verification Methods
  async verifyProfileNameVisible() {
    await expect(this.locators.profileNameHeading).toBeVisible({ timeout: 30000 });
    await expect(this.locators.profileNameHeading).not.toHaveText('');
  }

  async verifyProfileTabs() {
    await expect(this.locators.postsTab).toBeVisible();
    await expect(this.locators.aboutTab).toBeVisible();
    await expect(this.locators.friendsTab).toBeVisible();
    await expect(this.locators.photosTab).toBeVisible();
  }

  async verifyTabSelected(tabName) {
    await expect(this.locators.tabByName(tabName)).toHaveAttribute('aria-selected', 'true');
  }

  // Business Methods
  async verifyProfilePageLoaded() {
    log('Verifying profile page');
    await this.verifyProfileNameVisible();
    await this.verifyProfileTabs();
  }

  async openTabAndVerify(tabName) {
    log(`Opening ${tabName} tab`);
    await this.clickTab(tabName);
    await this.verifyTabSelected(tabName);
  }
}

module.exports = { ProfilePage };
