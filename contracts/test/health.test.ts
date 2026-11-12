import { describe, expect, it } from 'vitest';
import { API_VERSION, HealthResponse } from '../src/index.js';

describe('contracts health schema (layer1-skeleton#AC-3)', () => {
  it('names the API version v1', () => {
    expect(API_VERSION).toBe('v1');
  });

  it('accepts an ok body', () => {
    expect(HealthResponse.safeParse({ status: 'ok', apiVersion: 'v1', database: 'ok' }).success).toBe(true);
  });

  it('accepts an unavailable body', () => {
    expect(
      HealthResponse.safeParse({ status: 'unavailable', apiVersion: 'v1', database: 'unavailable' }).success,
    ).toBe(true);
  });

  it('rejects a body with a missing field', () => {
    expect(HealthResponse.safeParse({ status: 'ok', apiVersion: 'v1' }).success).toBe(false);
  });

  it('rejects an unknown status', () => {
    expect(HealthResponse.safeParse({ status: 'fine', apiVersion: 'v1', database: 'ok' }).success).toBe(false);
  });

  it('rejects another API version', () => {
    expect(HealthResponse.safeParse({ status: 'ok', apiVersion: 'v2', database: 'ok' }).success).toBe(false);
  });
});
