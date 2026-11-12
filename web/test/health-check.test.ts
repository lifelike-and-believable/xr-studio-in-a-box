import { describe, expect, test } from 'vitest';
import { checkHealth } from '../src/health/check';

describe('health check is bounded in time (layer1-skeleton#AC-5)', () => {
  test('reports unavailable when the probe never settles', async () => {
    const started = Date.now();
    const result = await checkHealth(() => new Promise(() => {}), 50);
    expect(result.httpStatus).toBe(503);
    expect(result.body).toEqual({ status: 'unavailable', apiVersion: 'v1', database: 'unavailable' });
    expect(Date.now() - started).toBeLessThan(1000);
  });

  test('reports ok when the probe settles before the deadline', async () => {
    const result = await checkHealth(() => Promise.resolve([]), 1000);
    expect(result.httpStatus).toBe(200);
  });
});
