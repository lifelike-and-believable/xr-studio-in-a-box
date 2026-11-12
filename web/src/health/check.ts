import { API_VERSION, type HealthResponseBody } from '@xr/contracts';

export type HealthResult = { httpStatus: 200 | 503; body: HealthResponseBody };

// Longer than the pool's connection and query timeouts, as a last bound on the probe.
export const HEALTH_DEADLINE_MS = 5000;

// The probe's error is dropped on purpose: the response must not reveal connection details.
export async function checkHealth(
  probe: () => Promise<unknown>,
  deadlineMs: number = HEALTH_DEADLINE_MS,
): Promise<HealthResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('deadline')), deadlineMs);
  });
  try {
    await Promise.race([probe(), deadline]);
    return { httpStatus: 200, body: { status: 'ok', apiVersion: API_VERSION, database: 'ok' } };
  } catch {
    return {
      httpStatus: 503,
      body: { status: 'unavailable', apiVersion: API_VERSION, database: 'unavailable' },
    };
  } finally {
    clearTimeout(timer);
  }
}
