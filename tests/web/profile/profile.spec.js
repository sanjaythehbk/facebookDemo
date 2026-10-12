import { webTest } from '../../../fixture/web.fixture.js';
import { BasePage } from '../../../pageobjects/BasePage.js';

webTest('should open profile and show name heading with Posts, About, Friends and Photos tabs', { tag: ['@regression', '@TC009'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Home.navigateToProfile();
  await basePage.Profile.verifyProfilePageLoaded();
});
