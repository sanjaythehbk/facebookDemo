/**
 * Utility functions for explicit waits in tests.
 * Naming convention follows purpose-based delays.
 */

/**
 * Waits for a small delay (1 second).
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForSmallDelay(page) {
    await page.waitForTimeout(1000);
}

/**
 * Waits for table content to load (2 seconds).
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForTableLoad(page) {
  await page.waitForTimeout(2000);
}

/**
 * Waits for form elements to stabilize (3 seconds).
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForFormLoad(page) {
  await page.waitForTimeout(3000);
}

/**
 * Waits for a full page or major component load (5 seconds).
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForPageLoad(page) {
    await page.waitForTimeout(5000);
}

/**
 * Waits for 4 seconds.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForMediumDelay(page) {
    await page.waitForTimeout(4000);
}

/**
 * Waits for 8 seconds.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForLongDelay(page) {
    await page.waitForTimeout(8000);
}

/**
 * Waits for 10 seconds for complex processes.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForProcessCompletion(page) {
    await page.waitForTimeout(10000);
}

/**
 * Waits for 12 seconds for Office Web Editors to load.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForOfficeEditorLoad(page) {
    await page.waitForTimeout(12000);
}

/**
 * Waits for 15 seconds for network-dependent elements (search results, grid rows after delete).
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function waitForNetworkLoad(page) {
    await page.waitForTimeout(15000);
}

// Legacy aliases for backward compatibility during transition (optional, but I will replace them all)
export const waitFor1Second = waitForSmallDelay;
export const waitFor2Seconds = waitForTableLoad;
export const waitFor3Seconds = waitForFormLoad;
export const waitFor4Seconds = waitForMediumDelay;
export const waitFor5Seconds = waitForPageLoad;
export const waitFor8Seconds = waitForLongDelay;
export const waitFor10Seconds = waitForProcessCompletion;
export const waitFor12Seconds = waitForOfficeEditorLoad;
export const waitFor15Seconds = waitForNetworkLoad;
