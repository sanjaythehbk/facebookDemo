// @ts-check
process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --experimental-require-module';
import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './tests',
  timeout: 200 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  retries: 2, // Retry failed tests up to 2 times

  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }]
  ],

  use: {
    actionTimeout: 30 * 1000,
    trace: 'retain-on-failure',
    screenshot: 'on',
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
    launchOptions: {
      args: process.env.CI ? ['--window-size=1920,1080'] : ['--start-maximized']
    }
  },

  projects: [
    {
      name: 'chromium',
      use: {
        headless: process.env.CI ? true : false,
      },
    }
  ],
});

export default config;
