import { expect, test } from '@playwright/test';
import { HealthResponse } from '@xr/contracts';

test('health reports ok with a migrated database (layer1-skeleton#AC-4)', async ({ request }) => {
  const response = await request.get('/api/v1/health');
  expect(response.status()).toBe(200);
  const body: unknown = await response.json();
  expect(HealthResponse.safeParse(body).success).toBe(true);
  expect(body).toEqual({ status: 'ok', apiVersion: 'v1', database: 'ok' });
});

test('health reports unavailable without leaking details (layer1-skeleton#AC-5)', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:3101/api/v1/health');
  expect(response.status()).toBe(503);
  const text = await response.text();
  expect(JSON.parse(text)).toEqual({ status: 'unavailable', apiVersion: 'v1', database: 'unavailable' });
  for (const leak of ['postgres://', '127.0.0.1', 'nobody', 'ECONNREFUSED', 'Error', 'at ']) {
    expect(text).not.toContain(leak);
  }
});
