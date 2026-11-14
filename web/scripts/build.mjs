// The build command for every environment (help-tutorials-and-previews#AC-16): Help, then the
// preview's database when this is a preview on Vercel in try mode, then the app.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { preparePreviewDatabase } from '../src/try/preview-build.ts';

const web = path.resolve(import.meta.dirname, '..');
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { cwd: web, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run(process.execPath, [path.join(web, 'scripts/help-content.mjs')]);
// The same row as writeTrialMark in the command layer, which this script cannot load.
const mark = (owner) => owner.query("insert into app_meta (key, value) values ('trial-copy', 'yes') on conflict (key) do nothing");
try {
  const done = await preparePreviewDatabase(process.env, path.join(web, 'drizzle'), mark);
  if (done === 'prepared') console.log('Preview: the trial copy is at its first starting point.');
} catch (error) {
  // The message names no address or password.
  console.error(error instanceof Error ? error.message : 'trial copy: the database could not be prepared');
  process.exit(1);
}
run('pnpm', ['exec', 'next', 'build']);
