import { webTest } from '../../../fixture/web.fixture.js';
import { BasePage } from '../../../pageobjects/BasePage.js';

webTest('should show search bar, navigation icons and post composer on home feed', { tag: ['@smoke', '@regression', '@TC008'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Home.verifyHomePageElements();
});
