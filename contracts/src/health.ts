import { z } from 'zod';

export const API_VERSION = 'v1' as const;

export const HealthResponse = z
  .object({
    status: z.enum(['ok', 'unavailable']),
    apiVersion: z.literal(API_VERSION),
    database: z.enum(['ok', 'unavailable']),
  })
  .strict();

export type HealthResponseBody = z.infer<typeof HealthResponse>;
