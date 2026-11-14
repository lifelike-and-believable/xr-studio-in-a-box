import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { pnpmCommand } from '../src/try/preview-build';

// pnpm run try, build and e2e start pnpm themselves. On Windows `pnpm` is a .cmd file, which Node
// cannot start without a shell, so starting it by name failed there with ENOENT.
describe('pnpmCommand', () => {
  it('starts the pnpm that runs this script, on every platform', () => {
    const [command, args] = pnpmCommand(['--version']);
    const r = spawnSync(command, args, { encoding: 'utf8' });
    expect(r.error).toBeUndefined();
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('runs a JavaScript pnpm with Node and a native one directly', () => {
    expect(pnpmCommand(['run', 'build'], { npm_execpath: '/usr/lib/pnpm/bin/pnpm.cjs' })).toEqual([process.execPath, ['/usr/lib/pnpm/bin/pnpm.cjs', 'run', 'build']]);
    expect(pnpmCommand(['run', 'build'], { npm_execpath: 'C:\\pnpm\\pnpm.exe' })).toEqual(['C:\\pnpm\\pnpm.exe', ['run', 'build']]);
  });

  it('falls back to pnpm by name outside a pnpm script', () => {
    expect(pnpmCommand(['run', 'build'], {})).toEqual(['pnpm', ['run', 'build']]);
  });
});
