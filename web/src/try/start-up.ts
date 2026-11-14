import { productionSetting, type Env } from './mode';

export const MARKED_IN_PRODUCTION =
  'This database was used as a trial copy, and a production instance does not start on it. Give production its own database.';

// What a server instance checks as it starts (trying-the-product#AC-5): a production instance
// refuses a database that was ever a trial copy, and both settings at once are logged, not fatal,
// because a stray setting should not take production down.
export async function checkStartUp(env: Env, readMark: () => Promise<boolean>, log: (message: string) => void): Promise<void> {
  if (!productionSetting(env)) return;
  if (env.XR_TRY === '1') log('XR_TRY=1 is ignored because the production setting (XR_PRODUCTION or VERCEL_ENV=production) is on; try mode is off.');
  if (await readMark()) throw new Error(MARKED_IN_PRODUCTION);
}
