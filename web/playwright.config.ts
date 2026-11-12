import { defineConfig } from '@playwright/test';

// The app runs twice from the same production build: once against the test database, and once
// against an address where nothing listens, to check how health reports an unreachable database.
const unreachableDatabase = 'postgres://nobody:nothing@127.0.0.1:1/none';

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  forbidOnly: !!process.env.CI,
  // One worker: the hung-database test locks app_meta, which would also stall the AC-4 test.
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  webServer: [
    {
      command: 'pnpm exec next start -p 3100 -H 127.0.0.1',
      url: 'http://127.0.0.1:3100',
      reuseExistingServer: false,
      // Passed only when set: Next.js never overrides a defined variable, so an empty value
      // would hide the one in web/.env.
      env: process.env.DATABASE_URL ? { DATABASE_URL: process.env.DATABASE_URL } : {},
    },
    {
      command: 'pnpm exec next start -p 3101 -H 127.0.0.1',
      url: 'http://127.0.0.1:3101',
      reuseExistingServer: false,
      env: { DATABASE_URL: unreachableDatabase },
    },
  ],
});
