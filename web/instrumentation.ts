// Runs once when a server instance starts, before it handles requests. A bad DATABASE_URL stops
// start-up here, instead of looking like a database outage on every health check. A production
// instance on a database that was a trial copy stops here too (trying-the-product#AC-5).
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { serverEnv } = await import('./src/env');
  serverEnv();
  const { checkStartUp } = await import('./src/try/start-up');
  const { isMarked } = await import('./src/try/mark');
  // An unreachable database is the health check's to report, not a reason to stop here.
  const readMark = () => isMarked().catch(() => false);
  await checkStartUp(process.env, readMark, (message) => console.error(message));
}
