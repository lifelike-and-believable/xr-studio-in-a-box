// Runs once when a server instance starts, before it handles requests. A bad DATABASE_URL stops
// start-up here, instead of looking like a database outage on every health check.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { serverEnv } = await import('./src/env');
  serverEnv();
}
