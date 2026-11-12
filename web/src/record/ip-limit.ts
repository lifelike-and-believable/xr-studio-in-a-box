import 'server-only';

// A coarse per-IP limit for the public sign-in request route, on top of the per-address limit of
// one email a minute (layer1-organisations-projects-people#AC-3). It counts requests in a sliding
// minute in this server instance's memory, as Better Auth's own route limit does; it slows a flood
// from one address, and the per-address limit in the record is the control that holds everywhere.
const WINDOW_MS = 60_000;
export const SIGN_IN_REQUESTS_PER_IP = 60;

let seen = new Map<string, number[]>();

export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip')?.trim() || 'unknown';
}

export function overIpLimit(ip: string, now = Date.now(), max = SIGN_IN_REQUESTS_PER_IP): boolean {
  const recent = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  seen.set(ip, recent);
  // Forget addresses with no request in the last minute, so the map stays small.
  if (seen.size > 10_000) seen = new Map([...seen].filter(([, times]) => times.some((t) => now - t < WINDOW_MS)));
  return recent.length > max;
}
