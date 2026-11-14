import 'server-only';

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
  const list = (process.env.APP_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
  return list.length > 0 ? list : ['http://localhost:3000'];
}

// The origin of the request, if it is one of ours; otherwise the first configured origin.
export function originOf(headers: Headers): string {
  const host = headers.get('host');
  const proto = headers.get('x-forwarded-proto') ?? 'http';
  const candidate = host ? `${proto}://${host}` : '';
  const origins = appOrigins();
  return origins.includes(candidate) ? candidate : (origins[0] ?? 'http://localhost:3000');
}

export function originsFrom(env: Record<string, string | undefined>): string[] {
  void env;
  return [];
}

export function passkeyFrom(env: Record<string, string | undefined>): { rpID: string; origins: string[] } {
  void env;
  return { rpID: '', origins: [] };
}
