import { randomBytes } from 'node:crypto';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Next.js supplies server-only to the server bundle; unit tests run outside it.
    alias: {
      'server-only': fileURLToPath(
        new URL('./node_modules/next/dist/compiled/server-only/empty.js', import.meta.url),
      ),
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    // Slice 2's commands sign uploads, keep their bytes in a folder and hash confirmed text; each
    // run gets its own values, as the end-to-end runner does.
    env: {
      STORAGE_DIR: process.env.STORAGE_DIR || mkdtempSync(path.join(tmpdir(), 'xr-storage-')),
      STORAGE_SIGNING_SECRET: process.env.STORAGE_SIGNING_SECRET || randomBytes(32).toString('hex'),
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || randomBytes(32).toString('hex'),
    },
  },
});
