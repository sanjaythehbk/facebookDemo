import { apiTest } from '../../fixture/api.fixture.js';
import { expect } from '@playwright/test';

apiTest('should return id and name for the authenticated user from GET /me', { tag: ['@smoke', '@TC010'] }, async ({ apiSetup }) => {
  expect(apiSetup.userId).toBeTruthy();
  expect(apiSetup.userName).toBeTruthy();

  const { response, body } = await apiSetup.api.user.getUserById(apiSetup.userId);
  expect(response.ok()).toBeTruthy();
  expect(body.id).toBe(apiSetup.userId);
  expect(body.name).toBe(apiSetup.userName);
});
