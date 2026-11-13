'use client';
import Link from 'next/link';
import { useState } from 'react';
import { nowTime, useUpdates } from '@/ui/use-updates';
import type { NeedRow, NeedSection, NeedsView } from '@/ui/work-view';

type Shown = NeedRow & { isNew?: boolean; gone?: string };
type ShownSection = Omit<NeedSection, 'groups'> & { groups: { id: string; heading: string; count: string; items: Shown[] }[] };
type Fresh = NeedsView & { outcomes: Record<string, { kind: string; line: string }> };

const NEW_PHRASE: Record<string, string> = { decide: 'for your decision', returned: 'returned to you', assigned: 'assigned to you', waiting: 'waiting for others' };
const GONE_WORD: Record<string, string> = { accept: 'accepted', reject: 'rejected', withdraw: 'withdrawn', sent: 'sent for review', revise: 'returned for revision' };
const items = (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`;

// Rows are never removed while the page is open: a new one is added in its place with a New tag,
// and one that no longer needs the person is replaced by a line saying what happened
// (layer1-versions-board-first-view#AC-39).
function merge(shown: ShownSection[], fresh: Fresh): { sections: ShownSection[]; added: Record<string, number>; gone: Record<string, number> } {
  const rows = new Map<string, { kind: string; groupId: string; row: NeedRow }>();
  for (const s of fresh.sections) for (const g of s.groups) for (const r of g.items) rows.set(r.key, { kind: s.kind, groupId: g.id, row: r });
  const added: Record<string, number> = {};
  const gone: Record<string, number> = {};
  const sections: ShownSection[] = shown.map((s) => ({
    ...s,
    groups: s.groups.map((g) => ({
      ...g,
      count: fresh.sections.find((x) => x.kind === s.kind)?.groups.find((x) => x.id === g.id)?.count ?? g.count,
      items: g.items.map((i) => {
        if (i.gone) return i;
        const now = rows.get(i.key);
        if (now) return { ...now.row, isNew: i.isNew };
        const outcome = fresh.outcomes[i.key];
        gone[outcome?.kind ?? 'gone'] = (gone[outcome?.kind ?? 'gone'] ?? 0) + 1;
        return { ...i, gone: outcome?.line ?? `${i.title} no longer needs you.` };
      }),
    })),
  }));
  const present = new Set(sections.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.key))));
  for (const s of fresh.sections) {
    for (const g of s.groups) {
      for (const r of g.items) {
        if (present.has(r.key)) continue;
        added[s.kind] = (added[s.kind] ?? 0) + 1;
        let section = sections.find((x) => x.kind === s.kind);
        if (!section) {
          section = { kind: s.kind, heading: s.heading, intro: s.intro, groups: [] };
          const order = fresh.sections.map((x) => x.kind);
          const at = sections.findIndex((x) => order.indexOf(x.kind) > order.indexOf(s.kind));
          sections.splice(at === -1 ? sections.length : at, 0, section);
        }
        let group = section.groups.find((x) => x.id === g.id);
        if (!group) {
          group = { id: g.id, heading: g.heading, count: g.count, items: [] };
          section.groups.push(group);
        }
        group.items.push({ ...r, isNew: true });
      }
    }
  }
  return { sections, added, gone };
}

export function NeedsLive({ initial }: { initial: NeedsView }) {
  const [view, setView] = useState<NeedsView>(initial);
  const [sections, setSections] = useState<ShownSection[]>(initial.sections);
  const [status, setStatus] = useState('');
  const shownRows = sections.flatMap((s) => s.groups.flatMap((g) => g.items.filter((i) => !i.gone)));

  useUpdates(
    () => `/api/v1/what-needs-you?${new URLSearchParams([...shownRows.map((r) => ['known', r.key]), ...shownRows.map((r) => ['title', r.title])])}`,
    (data) => {
      const fresh = data as Fresh;
      if (fresh.stamp === view.stamp) return;
      const merged = merge(sections, fresh);
      setSections(merged.sections);
      setView(fresh);
      const said = [
        ...Object.entries(merged.added).map(([kind, n]) => `${n} new ${n === 1 ? 'item' : 'items'} ${NEW_PHRASE[kind]}.`),
        ...Object.entries(merged.gone).map(([kind, n]) => (GONE_WORD[kind] ? `${items(n)} ${GONE_WORD[kind]}.` : `${items(n)} no longer ${n === 1 ? 'needs' : 'need'} you.`)),
      ];
      if (said.length) setStatus(`Updated ${nowTime(new Date())}: ${said.join(' ')}`);
    },
    (at) => setStatus(`Could not check for updates at ${nowTime(at)}. Trying again in a minute. This page may be out of date; reload it to check now.`),
  );

  const nothing = sections.length === 0;
  return (
    <>
      {nothing ? (
        view.empty.waitingOnly ? (
          <p>{view.empty.waitingOnly}</p>
        ) : (
          <>
            <p>Nothing needs you right now.</p>
            {view.empty.newcomers.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {view.empty.general ? (
              <>
                <p>Nothing is waiting for your decision, nothing you sent has come back, and no work is assigned to you. This page updates by itself when that changes.</p>
                <p>To see where everything stands on a project, open its Board:</p>
                <ul>
                  {view.boards.map((b) => (
                    <li key={b.href}>
                      <Link href={b.href}>{b.name}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        )
      ) : (
        <p>{view.count ?? view.empty.waitingOnly}</p>
      )}
      <p role="status" aria-live="polite" data-updates="" className="updates">
        {status}
      </p>
      {sections.map((s) => (
        <section key={s.kind} aria-labelledby={`section-${s.kind}`}>
          <h2 id={`section-${s.kind}`}>{s.heading}</h2>
          <p>{s.intro}</p>
          {s.groups.map((g) => (
            <section key={g.id} aria-labelledby={`group-${s.kind}-${g.id}`} className="need-group">
              <div className="group-head">
                <h3 id={`group-${s.kind}-${g.id}`}>{g.heading}</h3>
                <p>{g.count}</p>
              </div>
              <ul className="needs">
                {g.items.map((i) =>
                  i.gone ? (
                    <li key={i.key}>
                      <p>{i.gone}</p>
                    </li>
                  ) : (
                    <li key={i.key}>
                      <h4>
                        <Link href={i.href}>{i.title}</Link>
                        {i.isNew ? <span className="tag">New</span> : null}
                      </h4>
                      <p>{i.line}</p>
                      {i.quote ? <p className="quote">{i.quote}</p> : null}
                      {i.blocking ? (
                        <p>
                          <span className="tag">Blocking</span> {i.blocking}
                        </p>
                      ) : null}
                      <p className="next">
                        <strong>Next step:</strong> {i.next}
                      </p>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
          {s.kind === 'decide' && view.handedOn ? (
            <p>Items you handed to a delegate are not listed here; they are in the delegate&apos;s list. You can still decide them from the project&apos;s Review tab.</p>
          ) : null}
        </section>
      ))}
      <h2>Your stages</h2>
      {view.panels.map((p) => (
        <details key={p.projectId} open={p.open}>
          <summary>How work moves on {p.name}</summary>
          <p>{p.roles}</p>
          {p.rows.length ? (
            <table>
              <caption>Your stages on {p.name} and who decides each</caption>
              <thead>
                <tr>
                  <th scope="col">Your stage</th>
                  <th scope="col">Who decides it</th>
                </tr>
              </thead>
              <tbody>
                {p.rows.map((r) => (
                  <tr key={r.stage}>
                    <th scope="row">{r.stage}</th>
                    <td data-label="Who decides it">{r.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <p>{p.ask}</p>
        </details>
      ))}
    </>
  );
}
