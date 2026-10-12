export class HomePageLocators {
  constructor(page) {
    this.page = page;

    // Top bar
    this.facebookLogoLink = page.locator('a[aria-label="Facebook"]').first();
    this.searchInput = page.locator('[aria-label="Search Facebook"]').first();

    // Primary navigation
    this.homeNavLink = page.locator('[aria-label="Home"]').first();
    this.friendsNavLink = page.locator('[aria-label="Friends"]').first();
    this.videoNavLink = page.locator('[aria-label="Video"]').first();
    this.marketplaceNavLink = page.locator('[aria-label="Marketplace"]').first();
    this.groupsNavLink = page.locator('[aria-label="Groups"]').first();

    // Account menu
    this.profileMenuBtn = page.locator('[aria-label="Your profile"], [aria-label="Account"]').first();
    this.profileMenuNameLink = page.getByRole('dialog').getByRole('link').first();
    this.seeAllProfilesText = page.getByText(/See all profiles/i);

    // Feed
    this.postComposer = page.locator('div[role="button"]').filter({ hasText: /What's on your mind/i }).first();
    this.feedRegion = page.locator('div[role="feed"]').first();
  }
}

module.exports = { HomePageLocators };
