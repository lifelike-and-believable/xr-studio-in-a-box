import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Every write in slice 1 goes through the command layer in src/record
// (layer1-organisations-projects-people#AC-37). Pages and route handlers may read and call
// commands; only the command layer, and the auth library's own adapter, write.
const web = path.resolve(import.meta.dirname, '..');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return files(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const source = [...files(path.join(web, 'app')), ...files(path.join(web, 'src'))].map((file) => ({
  file: path.relative(web, file),
  text: readFileSync(file, 'utf8'),
}));

describe('writes go through the command layer (layer1-organisations-projects-people#AC-37)', () => {
  it('has a command layer', () => {
    expect(source.map((s) => s.file)).toContain('src/record/commands.ts');
  });

  it('keeps database writes inside src/record', () => {
    const writers = source
      .filter((s) => /\.(insert|update|delete)\(\s*[a-zA-Z]/.test(s.text) || /\b(insert into|update \w+ set|delete from)\b/i.test(s.text))
      .map((s) => s.file)
      .filter((file) => !file.startsWith('src/record/'));
    expect(writers).toEqual([]);
  });

  it('keeps the database client out of pages and route handlers', () => {
    const importers = source
      .filter((s) => s.file.startsWith('app/'))
      .filter((s) => /from ['"](@\/db|\.\.?\/.*db\/client|drizzle-orm)/.test(s.text))
      .map((s) => s.file);
    expect(importers).toEqual([]);
  });

  it('reads roles from the database on each command, not from the session', () => {
    const commands = source.find((s) => s.file === 'src/record/commands.ts')?.text ?? '';
    expect(commands).toMatch(/rolesOf\(/);
    expect(commands).not.toMatch(/session\.(roles|permissions)/);
  });
});
