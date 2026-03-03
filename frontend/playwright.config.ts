import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir:      './tests/e2e',
  timeout:      30_000,
  retries:      process.env.CI ? 2 : 0,
  fullyParallel: true,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL:     process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    screenshot:  'only-on-failure',
    video:       'retain-on-failure',
    trace:       'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome']  } },
    { name: 'mobile',   use: { ...devices['iPhone 14']       } },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        port:    3000,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
