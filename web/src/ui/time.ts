import 'server-only';
import { cookies } from 'next/headers';

// Times are shown in the viewer's time zone, which the browser sends in the `tz` cookie; with
// none sent, America/Toronto (layer1-facts-identifiers-activity#AC-36).
export const DEFAULT_ZONE = 'America/Toronto';

export function validZone(zone: string | undefined): string {
  if (!zone) return DEFAULT_ZONE;
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: zone });
    return zone;
  } catch {
    return DEFAULT_ZONE;
  }
}

export async function viewerZone(): Promise<string> {
  return validZone((await cookies()).get('tz')?.value);
}

function parts(date: Date, zone: string) {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => p.find((x) => x.type === type)?.value ?? '';
  return { day: `${get('day')} ${get('month')}`, time: `${get('hour')}:${get('minute')}` };
}

// "12 November at 14:20", as in "Last changed by".
export const atTime = (date: Date, zone: string) => {
  const p = parts(date, zone);
  return `${p.day} at ${p.time}`;
};

// "12 November, 14:20", as in Activity.
export const entryTime = (date: Date, zone: string) => {
  const p = parts(date, zone);
  return `${p.day}, ${p.time}`;
};

export const dayOf = (date: Date, zone: string) => parts(date, zone).day;
export const timeOf = (date: Date, zone: string) => parts(date, zone).time;

// The instant a calendar day (YYYY-MM-DD) starts in a zone.
export function startOfDay(day: string, zone: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return null;
  const utc = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(utc)) return null;
  let guess = utc;
  for (let i = 0; i < 2; i++) guess = utc - offset(new Date(guess), zone);
  return new Date(guess);
}

function offset(date: Date, zone: string): number {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const n = (type: string) => Number(p.find((x) => x.type === type)?.value ?? 0);
  return Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second')) - Math.floor(date.getTime() / 1000) * 1000;
}
