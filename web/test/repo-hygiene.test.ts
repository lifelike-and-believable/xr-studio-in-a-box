import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..', '..');

function ignored(file: string): boolean {
  try {
    execFileSync('git', ['check-ignore', '-q', file], { cwd: root });
    return true;
  } catch {
    return false;
  }
}

describe('env files are ignored and the example holds no secrets (layer1-skeleton#AC-9)', () => {
  it('ignores .env and .env.* but not .env.example', () => {
    expect(ignored('.env')).toBe(true);
    expect(ignored('.env.local')).toBe(true);
    expect(ignored('web/.env.production')).toBe(true);
    expect(ignored('.env.example')).toBe(false);
  });

  it('lists both database URLs with placeholder values only', () => {
    const example = readFileSync(path.join(root, '.env.example'), 'utf8');
    const values = Object.fromEntries(
      example
        .split('\n')
        .filter((line) => /^[A-Z_]+=/.test(line))
        .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
    );
    expect(Object.keys(values).sort()).toEqual([
      'APP_ORIGINS',
      'BETTER_AUTH_SECRET',
      'CRON_SECRET',
      'DATABASE_URL',
      'DATABASE_URL_UNPOOLED',
      'MAIL_CAPTURE_DIR',
      'PASSKEY_ORIGINS',
      'PASSKEY_RP_ID',
      'SIGN_IN_FIRST_ADDRESSES',
      'STORAGE_DIR',
      'STORAGE_SIGNING_SECRET',
    ]);
    expect(values.DATABASE_URL).toBe('postgres://USER:PASSWORD@HOST:5432/DATABASE');
    expect(values.DATABASE_URL_UNPOOLED).toBe('postgres://USER:PASSWORD@HOST:5432/DATABASE');
    // Slice 1's settings: every value is a placeholder in angle brackets, not a value anyone
    // could use, so no secret can be committed here.
    for (const [name, value] of Object.entries(values)) {
      if (name.startsWith('DATABASE_URL')) continue;
      expect(value, name).toMatch(/^<[^<>]+>$/);
    }
  });
});
