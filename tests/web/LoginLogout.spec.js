// Login happens in the webTest fixture; this spec verifies the session and logs out
import { webTest } from '../../fixture/web.fixture.js';
import { BasePage } from '../../pageobjects/BasePage.js';

webTest('should log in with valid credentials and log out', { tag: ['@smoke', '@TC001'] }, async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.Home.verifyHomePageElements();
  await basePage.Login.logoutAndVerify();
});
