import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { getTableName, is } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import * as schema from '../src/db/schema';
import { productionSetting, tryMode } from '../src/try/mode';
import { PEOPLE, personByFirstName } from '../src/try/people';
import { APP_TABLES } from '../src/try/records';
import { TUTORIALS, tutorialById } from '../src/try/starting-points';

describe('try mode (trying-the-product#AC-1)', () => {
  const cases: [Record<string, string | undefined>, boolean][] = [
    [{}, false],
    [{ XR_TRY: '1' }, true],
    [{ XR_TRY: 'true' }, false],
    [{ XR_TRY: '0' }, false],
    [{ XR_TRY: '1', XR_PRODUCTION: '1' }, false],
    [{ XR_TRY: '1', XR_PRODUCTION: 'yes' }, false],
    [{ XR_TRY: '1', XR_PRODUCTION: '0' }, true],
    [{ XR_TRY: '1', XR_PRODUCTION: '' }, true],
    [{ XR_TRY: '1', VERCEL_ENV: 'production' }, false],
    [{ XR_TRY: '1', VERCEL_ENV: 'preview' }, true],
    [{ XR_TRY: '1', XR_PRODUCTION: '1', VERCEL_ENV: 'production' }, false],
    [{ XR_PRODUCTION: '1' }, false],
    [{ VERCEL_ENV: 'production' }, false],
  ];
  for (const [env, expected] of cases) {
    it(`${JSON.stringify(env)} -> ${expected ? 'yes' : 'no'}`, () => {
      expect(tryMode(env)).toBe(expected);
    });
  }

  it('the production setting is on for XR_PRODUCTION other than empty or 0, or VERCEL_ENV=production', () => {
    expect(productionSetting({})).toBe(false);
    expect(productionSetting({ XR_PRODUCTION: '' })).toBe(false);
    expect(productionSetting({ XR_PRODUCTION: '0' })).toBe(false);
    expect(productionSetting({ XR_PRODUCTION: '1' })).toBe(true);
    expect(productionSetting({ XR_PRODUCTION: 'on' })).toBe(true);
    expect(productionSetting({ VERCEL_ENV: 'production' })).toBe(true);
    expect(productionSetting({ VERCEL_ENV: 'preview' })).toBe(false);
  });
});

describe('the five people (trying-the-product#AC-12)', () => {
  it('are found by first name only', () => {
    expect(PEOPLE.map((p) => p.first)).toEqual(['Jordan', 'Morgan', 'Riley', 'Sam', 'Drew']);
    for (const p of PEOPLE) {
      expect(personByFirstName(p.first)).toBe(p);
      expect(p.email).toBe(`${p.first.toLowerCase()}@xr.test`);
    }
    for (const other of ['jordan@xr.test', 'jordan', 'Alex', '', PEOPLE[0]?.name ?? '']) {
      expect(personByFirstName(other)).toBeUndefined();
    }
  });
});

describe('emptying names every table of XR Studio (trying-the-product#AC-15)', () => {
  it('lists each table in the schema except app_meta, which keeps the mark, plus try_mail', () => {
    const tables = Object.values(schema)
      .filter((v) => is(v, PgTable))
      .map((t) => getTableName(t as PgTable))
      .filter((n) => n !== 'app_meta');
    expect([...APP_TABLES].sort()).toEqual([...tables].sort());
    expect(APP_TABLES).toContain('try_mail');
  });
});

// The list on Try XR Studio and docs/tutorials/ agree (trying-the-product#AC-8).
describe('the tutorials Try XR Studio offers (trying-the-product#AC-8)', () => {
  const dir = path.resolve(import.meta.dirname, '../../docs/tutorials');
  const tutorials = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = readFileSync(path.join(dir, f), 'utf8');
      const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
      const field = (k: string) => new RegExp(`^${k}:\\s*(.+)$`, 'm').exec(front)?.[1]?.trim() ?? null;
      return { file: `docs/tutorials/${f}`, id: field('id'), runner: field('runner'), startsFrom: field('starts-from'), title: /^# (.+)$/m.exec(text)?.[1] ?? '' };
    });

  it('lists every web tutorial, with its title and file', () => {
    const web = tutorials.filter((t) => t.runner === 'web');
    expect(TUTORIALS.map((t) => t.id).sort()).toEqual(web.map((t) => t.id).sort());
    for (const t of TUTORIALS) {
      const doc = tutorials.find((d) => d.id === t.id);
      expect(doc?.file).toBe(t.file);
      expect(doc?.title).toBe(t.title);
      expect(tutorialById(t.id)).toBe(t);
    }
    expect(tutorialById('tutorial-none')).toBeUndefined();
  });
});
