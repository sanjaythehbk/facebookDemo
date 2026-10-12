import { test as base } from '@playwright/test';
import { createApiContext } from '../api/context/apiContext.js';
import { apiFactory } from '../api/apiFactory.js';
import { meFieldsPayload } from '../api/payloads/auth.payload.js';
import { loadEnv } from '../utils/env.util.js';
import fs from 'fs';
import { log } from "node:console";

// Load environment variables
loadEnv();

// Function to update fetchedCreatedData.json with the authenticated Graph user
function updateFetchedCreatedData(userData) {
  const filePath = './testdata/fechedCreatedData.json';

  try {
    let existingData;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      existingData = { users: [], posts: [] };
    }

    existingData.users = [{
      userId: userData.id,
      name: userData.name,
      fetchedAt: new Date().toISOString()
    }];

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    log(`Updated fetchedCreatedData.json with user: ${userData.id}`);
  } catch (error) {
    console.error('Failed to update fetchedCreatedData.json:', error.message);
  }
}

export const apiTest = base.extend({
  apiSetup: async ({ request }, use) => {
    const apiContext = createApiContext(request);
    const api = apiFactory(apiContext);

    log('BASE_URL_API:', apiContext.baseUrl);

    const meResponse = await api.auth.getMe(meFieldsPayload());
    const responseText = await meResponse.text();
    log('GET /me status:', meResponse.status());

    if (!meResponse.ok()) {
      throw new Error(`Graph API /me failed: ${meResponse.status()} - ${responseText}. Check FB_ACCESS_TOKEN in config/{env}_config.env`);
    }

    const me = JSON.parse(responseText);
    updateFetchedCreatedData(me);

    // Graph API reads do not create resources, so there is nothing to tear down
    await use({
      token: apiContext.accessToken,
      userId: me.id,
      userName: me.name,
      api
    });
  }
});
