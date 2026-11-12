import 'server-only';
import { ACTIVITY_PAGE_SIZE } from '@xr/contracts';
import Link from 'next/link';
import type { Owner } from '@/record/commands';
import { activityFor, activityPeople } from '@/record/facts';
import { activityFilter, areasFor } from './activity-filter';
import { ErrorSummary } from './error-summary';
import { Notice } from './notice';
import { entryTime } from './time';

// The activity log, a project's or an organisation's (layer1-facts-identifiers-activity#AC-34 to
// AC-37). Filters are in the address; there is no control that changes an entry (AC-38).

export type ActivitySearch = { who?: string; area?: string; from?: string; to?: string; page?: string };

export async function ActivityView({ owner, path, zone, search }: { owner: Owner; path: string; zone: string; search: ActivitySearch }) {
  const areas = areasFor(owner.kind);
  const people = await activityPeople(owner);
  const parsed = activityFilter(owner.kind, search, zone);
  const filtered = Boolean(search.who || search.area || search.from || search.to);
  const result = parsed.ok ? await activityFor(owner, parsed.filter, ACTIVITY_PAGE_SIZE) : { total: 0, entries: [] };
  const page = parsed.ok ? parsed.filter.page : 0;
  const whoLabel = search.who === 'agents' ? 'Agents' : people.find((p) => p.id === search.who)?.label;
  const filterWords = [whoLabel, search.area ? areas[search.area] : undefined, search.from ? `from ${search.from}` : undefined, search.to ? `to ${search.to}` : undefined]
    .filter(Boolean)
    .join(', ');
  const line = `${result.total} ${result.total === 1 ? 'entry' : 'entries'}: ${filterWords}.`;
  const older = new URLSearchParams(Object.entries({ ...search, page: String(page + 1) }).filter((e): e is [string, string] => Boolean(e[1])));
  return (
    <section aria-labelledby="activity-title">
      <h2 id="activity-title">Activity</h2>
      {!parsed.ok ? <ErrorSummary errors={{ from: parsed.error }} ids={{ from: 'f-from' }} /> : null}
      <p className="lead">
        Everything done on this {owner.kind === 'project' ? 'project' : 'organisation'}, newest first. Nobody can change or remove an entry. Entries name
        what changed, never the text or figures, and never bank details or tax numbers.
      </p>
      {/* The result line takes focus; it comes before the filters so the next Tab reaches them. */}
      {parsed.ok && filtered && result.total > 0 ? <Notice title={line.replace(/\.$/, '')}>{line}</Notice> : null}
      {parsed.ok && result.total === 0 ? (
        filtered ? (
          <>
            <Notice title="No entries match">No entries match these filters.</Notice>
            {search.who === 'agents' ? <p>Agents arrive in a later release, so there are no agent entries yet.</p> : null}
            <p>
              <Link href={path}>Clear filters</Link>
            </p>
          </>
        ) : (
          <p>No entries yet.</p>
        )
      ) : null}
      <form method="get" action={path} className="filters" aria-label="Filter activity">
        <div className="filter-row">
          <div className="field">
            <label htmlFor="f-who">Who</label>
            <select id="f-who" name="who" defaultValue={search.who ?? ''}>
              <option value="">Anyone</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
              {owner.kind === 'project' ? <option value="agents">Agents</option> : null}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-area">Area</label>
            <select id="f-area" name="area" defaultValue={search.area ?? ''}>
              <option value="">All areas</option>
              {Object.entries(areas).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-from">From</label>
            <input type="date" id="f-from" name="from" defaultValue={search.from ?? ''} aria-invalid={!parsed.ok ? true : undefined} />
          </div>
          <div className="field">
            <label htmlFor="f-to">To</label>
            <input type="date" id="f-to" name="to" defaultValue={search.to ?? ''} />
          </div>
        </div>
        <div className="actions">
          <button type="submit">Apply filters</button>
          <Link href={path}>Clear filters</Link>
        </div>
      </form>
      {result.entries.length > 0 ? (
        <>
          {!filtered ? (
            <p>
              Showing the {page === 0 ? 'newest' : 'next'} {result.entries.length} of {result.total} entries.
            </p>
          ) : null}
          <table>
            <caption className="visually-hidden">Activity, newest first</caption>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Who</th>
                <th scope="col">What</th>
                <th scope="col">Area</th>
              </tr>
            </thead>
            <tbody>
              {result.entries.map((e) => (
                <tr key={e.id}>
                  <td data-label="When">{entryTime(e.at, zone)}</td>
                  <td data-label="Who">{e.who}</td>
                  <td data-label="What">{e.what}</td>
                  <td data-label="Area">{e.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(page + 1) * ACTIVITY_PAGE_SIZE < result.total ? (
            <div className="actions">
              <Link href={`${path}?${older}`}>Older entries</Link>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

// The page title leads with the result line, as the notice does (AC-35).
export async function activityTitle(owner: Owner, zone: string, search: ActivitySearch): Promise<string> {
  const parsed = activityFilter(owner.kind, search, zone);
  if (!parsed.ok) return 'Error: Activity';
  if (!(search.who || search.area || search.from || search.to)) return 'Activity';
  const { total } = await activityFor(owner, parsed.filter, 1);
  if (total === 0) return 'No entries match - Activity';
  const areas = areasFor(owner.kind);
  const people = await activityPeople(owner);
  const words = [search.who === 'agents' ? 'Agents' : people.find((p) => p.id === search.who)?.label, search.area ? areas[search.area] : undefined, search.from ? `from ${search.from}` : undefined, search.to ? `to ${search.to}` : undefined]
    .filter(Boolean)
    .join(', ');
  return `${total} ${total === 1 ? 'entry' : 'entries'}: ${words} - Activity`;
}
