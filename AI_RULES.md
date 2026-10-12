# Playwright Automation Rules

## Test File Rules
- Do NOT create new test files if already created with same/matching name
- Modify only existing test files if the file already exists
- Reuse existing Page Object methods
- If a method is missing, add it to the Page Object (locators and page methods)
- Tests files must call business-level methods only from Page Objects
- Use frameLocator() for iframes

## Code Design & Organization Rules

### Page Object Design Principles
- **Single Responsibility**: Each method should perform one specific action
- **Atomic Functions**: Create individual functions for each UI interaction step
- **Business-Level Abstraction**: Combine atomic functions into high-level business methods
- **No Direct Locators in Page Methods**: All locators must be defined in respective Locator classes

### Method Organization Pattern
1. **Action Methods**: Individual functions for single UI interactions (e.g., `clickButton()`, `selectOption()`)
2. **Verification Methods**: Functions that verify UI state (e.g., `verifyElementVisible()`)
3. **Business Methods**: High-level functions that combine multiple action/verification methods
4. **Test Integration**: Tests should only call business-level methods

### Locator Management
- All locators MUST be defined in separate Locator classes (e.g., `NotebookPageLocators.js`)
- Use descriptive locator names that clearly indicate their purpose
- Group related locators logically within the Locator class
- Avoid inline locators in Page Object methods

### Function Naming Conventions
- **Action Methods**: Use verb-noun pattern (e.g., `clickProjectMenu()`, `selectFilterOption()`)
- **Verification Methods**: Use `verify` prefix (e.g., `verifyElementVisible()`, `verifyTextPresent()`)
- **Business Methods**: Use descriptive names that describe the complete flow (e.g., `navigateToProjectAndApplyTemplate()`)

### Code Structure Example
```javascript
// ❌ BAD: Complex method with multiple responsibilities
async complexFlow() {
  await page.locator('#menu').click();
  await page.locator('#option').click();
  if (condition) await page.locator('#close').click();
  await page.getByText('project').click();
}

// ✅ GOOD: Individual action methods
async clickMenu() {
  await this.locators.menuIcon.click();
}

async selectOption() {
  await this.locators.optionLink.click();
}

async closeIfVisible() {
  if (await this.locators.closeIcon.isVisible()) {
    await this.locators.closeIcon.click();
  }
}

// ✅ BEST: High-level business method
async completeBusinessFlow() {
  await this.clickMenu();
  await this.selectOption();
  await this.closeIfVisible();
  await this.selectProject();
}
```

### Test File Structure
- Tests should be clean and readable
- Each test should call only business-level methods
- Use descriptive test names that match business requirements
- Include proper test tags for categorization (@smoke, @TCxxx, etc.)

### Framework Standards Compliance
- Follow existing patterns in the codebase
- Maintain consistency with similar page objects
- Use existing utility functions when available
- Ensure all methods have proper error handling
- Add meaningful comments for complex business logic
