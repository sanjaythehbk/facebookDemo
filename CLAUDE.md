# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright-based UI automation framework (with Graph API integration) for the Facebook web application. This is a demo project that mirrors the `qa_automation_base` framework structure one-to-one. JavaScript (CommonJS with ES module config), Playwright v1.58.1.

## Common Commands

```bash
# Run all tests
npx playwright test

# Run a single test file
npx playwright test tests/web/LoginLogout.spec.js

# Run only tests that do not need a logged-in account
npx playwright test tests/web/login tests/web/signup tests/web/forgotPassword

# Run tests matching a grep pattern
npx playwright test --grep "test name"

# Run by tag
npx playwright test --grep "@smoke"

# Run headed (visible browser)
npx playwright test --headed

# Run in CI mode (headless)
CI=true npx playwright test

# Switch environment (default: stage)
ENV=dev npx playwright test

# Save a logged-in session once to avoid repeated logins
npm run auth:save

# View HTML test report
npx playwright show-report

# Allure reporting
npm run allure:generate
npm run allure:open
npm run allure:serve

# Clean all artifacts
npm run clean:all
```

## Architecture

### Three-Layer Page Object Model

1. **Locators** (`pageobjects/locators/{Page}PageLocators.js`) - all selectors live here, never inline in page methods
2. **Page Objects** (`pageobjects/pages/{Page}Page.js`) - action methods, verification methods, and business methods that compose them
3. **BasePage** (`pageobjects/BasePage.js`) - coordinator that initializes all page objects and exposes them via uppercase getters

### Page Object Directory Structure

```
pageobjects/pages/
  LoginPage.js                 -- login form, invalid login, logout
  SignupPage.js                -- Create new account form (/reg/)
  ForgotPasswordPage.js        -- Find your account flow (/recover/initiate/)
  Home/HomePage.js             -- logged-in home feed, nav, post composer
  Profile/ProfilePage.js       -- profile heading and tabs
```

### BasePage Getters

```
.Login, .Signup, .ForgotPassword, .Home, .Profile
```

### Locator Files

```
pageobjects/locators/
  LoginPageLocators.js, SignupPageLocators.js,
  ForgotPasswordPageLocators.js, HomePageLocators.js,
  ProfilePageLocators.js
```

### Fixture System

- `fixture/web.fixture.js`
  - `webTest` - opens `BASE_URL`, dismisses the cookie banner, logs in with `email` + `PASSWORD`, provides `page`
  - `guestTest` - opens `BASE_URL`, dismisses the cookie banner, does NOT log in. Use for login page, signup, and forgot password tests
- `fixture/api.fixture.js` - `apiTest` calls Graph API `GET /me` with `FB_ACCESS_TOKEN` and provides `apiSetup` with `token`, `userId`, `userName`, `api`
- `fixture/combined.fixture.js` - `combinedTest` merges `apiTest` + `webTest`

```js
// Logged-in UI test
import { webTest } from '../../fixture/web.fixture.js';
webTest('name', { tag: ['@smoke', '@TC001'] }, async ({ page }) => { ... });

// Unauthenticated UI test
import { guestTest } from '../../fixture/web.fixture.js';
guestTest('name', { tag: ['@regression', '@TC002'] }, async ({ page }) => { ... });

// API test
import { apiTest } from '../../fixture/api.fixture.js';
apiTest('name', { tag: ['@smoke', '@TC010'] }, async ({ apiSetup }) => { ... });
```

### API Client Layer

`api/` uses a factory pattern: `apiFactory(apiContext)` returns typed clients. The `apiContext` holds a Playwright `request` object, `baseUrl` (Graph API), and `accessToken`.

Available clients: `auth` (GET /me), `user` (GET /{id}, GET /me/permissions)

### Key Utilities

- `utils/uiHelper.js` - element interaction wrappers (`click`, `fill`, `hover`, `scrollIntoView`, `getText`, `wait`, `waitForElement`)
- `utils/wait.util.js` - named delays: `waitForSmallDelay` (1s), `waitForTableLoad` (2s), `waitForFormLoad` (3s), `waitForMediumDelay` (4s), `waitForPageLoad` (5s), `waitForLongDelay` (8s), `waitForProcessCompletion` (10s)
- `utils/fileHandling.util.js` - `readJSON`, `writeJSON`, `readCSV`, `writeCSV`, `parseHTMLTable`, `fileExists`, `deleteFile`
- `utils/env.util.js` - `loadEnv()` loads `config/{env}_config.env` (defaults to `stage`); `getEnvValue()` reads vars (throws if missing)
- `utils/logger.util.js` - structured logging to `logs/` directory

### Test Data

- `testdata/dataSetGenerator.js` - Faker-based generators with `STATIC_DATA` and `FAKER_GENERATORS`. Supports: user, signup, post, search. `getExistingModuleData('login')` reads static blocks from `testdata.json`.
- `testdata/testdata.json` - static test data (login error patterns, signup defaults, search queries)
- `testdata/fechedCreatedData.json` - dynamically updated by the API fixture with the authenticated Graph user
- `testdata/save-auth-state.js` - logs in once and writes `testdata/auth.json` (gitignored) for storageState reuse

### Test Directory Structure

```
tests/web/
  LoginLogout.spec.js           -- TC001 login + logout (webTest)
  login/
    loginPageElements.spec.js   -- TC002 (guestTest)
    invalidLogin.spec.js        -- TC003, TC004 (guestTest)
  signup/createAccount.spec.js  -- TC005, TC006 (guestTest)
  forgotPassword/forgotPassword.spec.js -- TC007 (guestTest)
  home/homeFeed.spec.js         -- TC008 (webTest)
  profile/profile.spec.js       -- TC009 (webTest)
tests/api/
  graphApi.spec.js              -- TC010 (apiTest)
```

### Environment Config

Two environments (`dev`, `stage`) via `config/{env}_config.env`. Stage is default. Key variables: `BASE_URL`, `email`, `PASSWORD`, `BASE_URL_API`, `FB_ACCESS_TOKEN`. Replace the placeholder values before running logged-in or API tests.

## Facebook-Specific Gotchas

- **Checkpoints**: repeated automated logins trigger captcha / "Confirm it's you" / 2FA. Use a dedicated test account with 2FA disabled, and prefer `npm run auth:save` + storageState reuse for local runs.
- **Two login designs**: Facebook is A/B rolling out a redesigned login page with no `#email` / `#pass` ids. Every form locator covers both designs with `.or()` (role/name first, classic id as fallback). See `.claude/rules/facebook-ui-patterns.md` for the mapping table.
- **Locale text**: copy differs by region (`Forgot password?` vs `Forgotten password?`). Locators use regex names.
- **Cookie banner**: EU regions show a consent dialog. Both fixtures call `dismissCookieBannerIfVisible()` before anything else.
- **Signup is a page**: Create new account navigates to `/reg/` (classic design opened a dialog). Forgot password navigates to `/recover/initiate/` with a Continue button (classic: `/login/identify/` with Search).
- **Logout confirm**: a "Log out of all accounts?" dialog may appear. `LoginPage.logout()` handles it.

See `.claude/rules/facebook-ui-patterns.md` for code examples.

## Code Rules (from AI_RULES.md)

- **No inline locators** - all locators in separate `{Page}PageLocators.js` classes
- **Atomic methods** - one UI action per method, compose into business methods
- **Tests call business methods only** - never raw action or verification methods directly
- **Method naming**: actions use verb-noun (`clickLogin`), verifications use `verify` prefix, business methods describe the full flow (`attemptLoginWithInvalidCredentialsAndVerifyError`)
- **Use `frameLocator()` for iframes**
- **Don't create duplicate test files** - modify existing ones
- **Reuse existing page object methods** - add missing ones to the page object, don't put logic in test files
- **Test tags**: use `@smoke`, `@regression`, `@TCxxx` for categorization
- **Ask before placing a new method** - if unsure which page object a method belongs in, ask the user rather than guessing

### Code Structure Pattern

```javascript
// Locator class - all selectors here
class LoginPageLocators {
  constructor(page) {
    this.emailInput = page.locator('#email');
    this.loginBtn = page.getByRole('button', { name: /^Log ?in$/i });
  }
}

// Page class - atomic actions -> business methods
async fillEmail(email) { await this.locators.emailInput.fill(email); }
async clickLogin() { await this.locators.loginBtn.click(); }
// Business method composes atomics
async login(email, password) {
  await this.fillEmail(email);
  await this.fillPassword(password);
  await this.clickLogin();
}

// Test - only calls business methods
webTest('should log in and log out @TC001', async ({ page }) => {
  const basePage = new BasePage(page);
  await basePage.Login.logoutAndVerify();
});
```

### New Tab / Popup Pattern

```javascript
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  actionThatOpensNewTab(),
]);
```

## Playwright Config Highlights

- Test timeout: 200s, expect timeout: 30s
- Retries: 2 (3 total attempts)
- Browser: Chromium (headless when `CI=true`, headed locally)
- Viewport: null locally (maximized window), 1920x1080 on CI
- Screenshots: always; traces: retained on failure
- Reporters: HTML + JUnit + Allure

## CI/CD

- **Jenkins** (`Jenkinsfile`): Docker-based parallel execution across 4 suites (Login, Signup, Home, Profile), Allure reporting, email notifications
- **CircleCI** (`.circleci/config.yml`): Node-based with npm caching, 4 parallel module jobs, consolidated Allure report job
