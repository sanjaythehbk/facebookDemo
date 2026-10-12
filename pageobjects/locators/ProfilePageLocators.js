export class ProfilePageLocators {
  constructor(page) {
    this.page = page;

    // Header
    this.profileNameHeading = page.getByRole('heading', { level: 1 }).first();
    this.editProfileBtn = page.getByRole('button', { name: /Edit profile/i }).first();
    this.addToStoryBtn = page.getByRole('button', { name: /Add to story/i }).first();

    // Tab strip - Facebook renders these as role="tab" links
    this.postsTab = page.getByRole('tab', { name: /^Posts$/i }).first();
    this.aboutTab = page.getByRole('tab', { name: /^About$/i }).first();
    this.friendsTab = page.getByRole('tab', { name: /^Friends$/i }).first();
    this.photosTab = page.getByRole('tab', { name: /^Photos$/i }).first();
  }

  tabByName(name) {
    return this.page.getByRole('tab', { name: new RegExp(`^${name}$`, 'i') }).first();
  }
}

module.exports = { ProfilePageLocators };
