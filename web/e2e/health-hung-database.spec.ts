import { expect, test } from '@playwright/test';
import { Client } from 'pg';

// A database that accepts connections but does not answer must not hold the request open.
test('health reports unavailable when the database stalls (layer1-skeleton#AC-5)', async ({ request }) => {
  const connectionString = process.env.DATABASE_URL;
  test.skip(!connectionString, 'needs DATABASE_URL to hold a lock on app_meta');

  const locker = new Client({ connectionString });
  await locker.connect();
  try {
    await locker.query('BEGIN');
    await locker.query('LOCK TABLE app_meta IN ACCESS EXCLUSIVE MODE');

    const started = Date.now();
    const response = await request.get('/api/v1/health', { timeout: 15_000 });
    expect(response.status()).toBe(503);
    expect(await response.json()).toEqual({ status: 'unavailable', apiVersion: 'v1', database: 'unavailable' });
    expect(Date.now() - started).toBeLessThan(8_000);
  } finally {
    await locker.query('ROLLBACK');
    await locker.end();
  }
});
