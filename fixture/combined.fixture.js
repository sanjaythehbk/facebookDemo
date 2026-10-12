import { mergeTests } from '@playwright/test';
import { apiTest } from './api.fixture.js';
import { webTest } from './web.fixture.js';

export const combinedTest = mergeTests(apiTest, webTest);
export { expect } from '@playwright/test';
