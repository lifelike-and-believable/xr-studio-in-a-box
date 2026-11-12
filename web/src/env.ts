import 'server-only';
import { z } from 'zod';

const ServerEnv = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

export type ServerEnv = z.infer<typeof ServerEnv>;

// The message names the variable but never its value, which can hold a password (SEC-001).
export const INVALID_DATABASE_URL = 'DATABASE_URL is missing or is not a postgres:// URL';

export function parseServerEnv(env: Record<string, string | undefined>): ServerEnv {
  const result = ServerEnv.safeParse({ DATABASE_URL: env.DATABASE_URL });
  if (!result.success) throw new Error(INVALID_DATABASE_URL);
  return result.data;
}

// Checked when the server starts (instrumentation.ts) and again on first use, not at build time,
// so the build does not need database settings (SEC-002).
export function serverEnv(): ServerEnv {
  return parseServerEnv(process.env);
}
