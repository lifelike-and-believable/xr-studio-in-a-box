import { describe, expect, test } from 'vitest';
import { INVALID_DATABASE_URL, parseServerEnv } from '../src/env';

// layer1-skeleton, non-functional requirements: database URLs are validated at start-up (SEC-002).
describe('server environment is validated without revealing values', () => {
  test('accepts a postgres URL', () => {
    expect(parseServerEnv({ DATABASE_URL: 'postgres://u:p@db.example:5432/x' }).DATABASE_URL).toBe(
      'postgres://u:p@db.example:5432/x',
    );
  });

  for (const [name, value] of [
    ['missing', undefined],
    ['empty', ''],
    ['another database', 'mysql://u:secret-pw@db.example:3306/x'],
    ['not a URL', 'secret-pw'],
  ] as const) {
    test(`refuses a ${name} DATABASE_URL with a message that hides the value`, () => {
      expect(() => parseServerEnv({ DATABASE_URL: value })).toThrow(INVALID_DATABASE_URL);
      try {
        parseServerEnv({ DATABASE_URL: value });
      } catch (error) {
        expect(String(error)).not.toContain('secret-pw');
        expect(String(error)).not.toContain('db.example');
      }
    });
  }
});
