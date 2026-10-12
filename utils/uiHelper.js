const { time } = require("node:console");

class UIHelper {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    // await locator.waitFor({ state: 'visible', timeout: 30000 });
    if (typeof locator === 'string') {
      await this.page.locator(locator).click();
    } else {
      await locator.click();
    }
  }

  async fill(locator, value) {
    // await locator.waitFor({ state: 'visible', timeout: 30000 });
    if (typeof locator === 'string') {
      await this.page.locator(locator).fill(value);
    } else {
      await locator.fill(value);
    }
  }

  async scrollIntoView(locator) {
    if (typeof locator === 'string') {
      await this.page.locator(locator).scrollIntoViewIfNeeded();
    } else {
      await locator.scrollIntoViewIfNeeded();
    }
  }

  async hover(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async wait(seconds) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  async getText(locator) {
    if (typeof locator === 'string') {
      return await this.page.locator(locator).textContent();
    } else {
      return await locator.textContent();
    }
  }

  async waitForElement(locator, timeout = 30000, interval = 1000) {
  const element = typeof locator === 'string'
    ? this.page.locator(locator)
    : locator;

  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    try {
      if (await element.isVisible()) {
        return element;
      }
    } catch (_) {}

    await this.page.waitForTimeout(interval);
  }

  throw new Error(`Element not visible after ${timeout}ms`);
  }
}

module.exports = { UIHelper };