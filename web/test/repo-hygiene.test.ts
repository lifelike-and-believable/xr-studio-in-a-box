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
    expect(Object.keys(values).sort()).toEqual(['DATABASE_URL', 'DATABASE_URL_UNPOOLED']);
    for (const value of Object.values(values)) {
      expect(value).toBe('postgres://USER:PASSWORD@HOST:5432/DATABASE');
    }
  });
});
