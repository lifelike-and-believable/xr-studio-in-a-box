import { API_VERSION, type HealthResponseBody } from '@xr/contracts';

export type HealthResult = { httpStatus: 200 | 503; body: HealthResponseBody };

// The probe's error is dropped on purpose: the response must not reveal connection details.
export async function checkHealth(probe: () => Promise<unknown>): Promise<HealthResult> {
  try {
    await probe();
    return { httpStatus: 200, body: { status: 'ok', apiVersion: API_VERSION, database: 'ok' } };
  } catch {
    return {
      httpStatus: 503,
      body: { status: 'unavailable', apiVersion: API_VERSION, database: 'unavailable' },
    };
  }
}
