import 'server-only';
import { tryMode } from '../try/mode';

type Env = Record<string, string | undefined>;
const list = (value: string | undefined) => (value ?? '').split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
// A preview on Vercel: a trial copy whose addresses Vercel gives it (help-tutorials-and-previews#AC-17).
const onVercelTrial = (env: Env) => tryMode(env) && env.VERCEL === '1' && Boolean(env.VERCEL_URL);

// SIGN_IN_FIRST_ADDRESSES: a comma-separated list, read at start-up, case-insensitive with spaces
// trimmed (layer1-organisations-projects-people#AC-11).
export function firstAddresses(): Set<string> {
  return new Set(
    (process.env.SIGN_IN_FIRST_ADDRESSES ?? '')
      .split(',')
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean),
  );
}

// APP_ORIGINS: the origins XR Studio is served from, first one used in emails when no request is
// at hand. Local work and tests default to localhost.
export function appOrigins(): string[] {
  return originsFrom(process.env);
}

// The origin of the request, if it is one of ours; otherwise the first configured origin.
export function originOf(headers: Headers): string {
  const host = headers.get('host');
  const proto = headers.get('x-forwarded-proto') ?? 'http';
  const candidate = host ? `${proto}://${host}` : '';
  const origins = appOrigins();
  return origins.includes(candidate) ? candidate : (origins[0] ?? 'http://localhost:3000');
}

export function originsFrom(env: Env): string[] {
  if (onVercelTrial(env)) return [...new Set([env.VERCEL_URL, env.VERCEL_BRANCH_URL].filter(Boolean).map((h) => `https://${h}`))];
  const given = list(env.APP_ORIGINS);
  return given.length > 0 ? given : ['http://localhost:3000'];
}

// Passkeys belong to the address they were made on: in a preview, the deployment's own.
export function passkeyFrom(env: Env): { rpID: string; origins: string[] } {
  if (onVercelTrial(env)) return { rpID: env.VERCEL_URL ?? '', origins: [`https://${env.VERCEL_URL}`] };
  const origins = list(env.PASSKEY_ORIGINS);
  return { rpID: env.PASSKEY_RP_ID ?? 'localhost', origins: origins.length > 0 ? origins : originsFrom(env) };
}
