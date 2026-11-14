import { defineConfig } from '@playwright/test';

// The app runs twice from the same production build: once against the test database, and once
// against an address where nothing listens, to check how health reports an unreachable database.
const unreachableDatabase = 'postgres://nobody:nothing@127.0.0.1:1/none';

// A try build (trying-the-product), made into .next-try by XR_TRY=1, runs against its own marked
// database (web/scripts/run-e2e.mjs), and again with each production setting, which must turn
// try mode off.
const trialDatabase = process.env.TRY_E2E_DATABASE_URL ?? '';
const trial = {
  XR_TRY: '1',
  DATABASE_URL: trialDatabase,
  DATABASE_URL_UNPOOLED: trialDatabase,
  SIGN_IN_FIRST_ADDRESSES: 'jordan@xr.test',
  APP_ORIGINS: 'http://127.0.0.1:3102',
  PASSKEY_ORIGINS: 'http://127.0.0.1:3102',
};
const trialWithProduction = (port: number, setting: Record<string, string>) => ({
  command: `pnpm exec next start -p ${port} -H 127.0.0.1`,
  url: `http://127.0.0.1:${port}`,
  reuseExistingServer: false,
  env: { ...setting, XR_TRY: '1', APP_ORIGINS: `http://127.0.0.1:${port}`, ...(process.env.DATABASE_URL ? { DATABASE_URL: process.env.DATABASE_URL } : {}) },
});

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
    {
      command: 'pnpm run build && pnpm exec next start -p 3102 -H 127.0.0.1',
      url: 'http://127.0.0.1:3102',
      reuseExistingServer: false,
      timeout: 300_000,
      env: trial,
    },
    trialWithProduction(3103, { XR_PRODUCTION: '1' }),
    trialWithProduction(3104, { VERCEL_ENV: 'production' }),
  ],
});
