import { z } from 'zod';

const ServerEnv = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

// Validated on first use so the build does not need database settings (SEC-002).
export function serverEnv(): z.infer<typeof ServerEnv> {
  return ServerEnv.parse({ DATABASE_URL: process.env.DATABASE_URL });
}
