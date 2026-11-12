import { z } from 'zod';

export const API_VERSION = 'v0' as const;

// Stub until the implementation commit.
export const HealthResponse = z.object({}).passthrough();

export type HealthResponseBody = z.infer<typeof HealthResponse>;
