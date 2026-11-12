import 'server-only';
import type { ActivityFilter } from '@/record/facts';
import { startOfDay } from './time';

// The activity filters in the address (layer1-facts-identifiers-activity#AC-35, AC-36). From and
// To are whole days in the viewer's zone and both are included.

export const PROJECT_AREAS = { project: 'Project', facts: 'Facts', people: 'People' } as const;
export const ORGANISATION_AREAS = {
  organisation: 'Organisation',
  'organisation-facts': 'Organisation facts',
  'identifier-formats': 'Identifier formats',
} as const;

export const FROM_AFTER_TO = 'Choose a From date before the To date.';

export function areasFor(kind: 'project' | 'organisation'): Record<string, string> {
  return kind === 'project' ? PROJECT_AREAS : ORGANISATION_AREAS;
}

export function activityFilter(
  kind: 'project' | 'organisation',
  params: Record<string, string | undefined>,
  zone: string,
): { ok: true; filter: ActivityFilter } | { ok: false; error: string } {
  const areas = areasFor(kind);
  const area = params.area && params.area in areas ? areas[params.area] : undefined;
  const from = params.from ? startOfDay(params.from, zone) : null;
  const toStart = params.to ? startOfDay(params.to, zone) : null;
  if (from && toStart && from > toStart) return { ok: false, error: FROM_AFTER_TO };
  // The end of the To day is the start of the next.
  const to = toStart ? (startOfDay(nextDay(params.to ?? ''), zone) ?? undefined) : undefined;
  const page = Math.max(0, Number.parseInt(params.page ?? '0', 10) || 0);
  const who = params.who === 'agents' && kind === 'project' ? 'agents' : params.who || undefined;
  return { ok: true, filter: { who, area, from: from ?? undefined, to, page } };
}

function nextDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
