'use client';
import Link from 'next/link';
import { useState } from 'react';
import { blockedLine, countLine, stageLine, stateLabel, type BoardData, type BoardRow } from '@/ui/board-text';
import { nowTime, useUpdates } from '@/ui/use-updates';

const BUILDS_NOTE = 'Builds reach these stages from the build pipeline in a later release.';

// The board's tables, updated in place (layer1-versions-board-first-view#AC-6 to AC-11). Rows are
// replaced, never removed under the reader: in Blocked work only, a row that stops being blocked
// stays until the next load.
export function BoardLive({ projectId, initial, blockedOnly }: { projectId: string; initial: BoardData; blockedOnly: boolean }) {
  const [data, setData] = useState(initial);
  const [changed, setChanged] = useState<Record<string, string>>({});
  const [kept] = useState(() => new Set(initial.work.filter((w) => w.state === 'blocked').map((w) => w.id)));
  const [status, setStatus] = useState('');

  useUpdates(
    () => `/api/v1/projects/${projectId}/board`,
    (next) => {
      const fresh = next as BoardData;
      if (fresh.stamp === data.stamp) return;
      const at = nowTime(new Date());
      const said: string[] = [];
      const marks: Record<string, string> = {};
      // In Blocked work only, rows that are shown, or that become blocked, are reported.
      const shown = (row: BoardRow) => !blockedOnly || kept.has(row.id) || row.state === 'blocked';
      for (const row of fresh.work) {
        if (!shown(row)) continue;
        const before = data.work.find((w) => w.id === row.id);
        if (!before) said.push(`${row.title} was added.`);
        else if (before.state !== row.state) said.push(`${row.title} is now ${stateLabel(row.state)}.`);
        else if (JSON.stringify(before) !== JSON.stringify(row)) said.push(`${row.title} changed.`);
        else continue;
        marks[row.id] = at;
      }
      for (const row of data.work) if (shown(row) && !fresh.work.some((w) => w.id === row.id)) said.push(`${row.title} was removed.`);
      setChanged((c) => ({ ...c, ...marks }));
      setData(fresh);
      if (said.length) setStatus(`Updated ${at}: ${said.join(' ')}`);
    },
    (at) => setStatus(`Could not check for updates at ${nowTime(at)}. Trying again in a minute. The board may be out of date; reload the page to check now.`),
  );

  if (blockedOnly) for (const w of data.work) if (w.state === 'blocked') kept.add(w.id);
  const visible = (w: BoardRow) => !blockedOnly || kept.has(w.id);
  const rows = data.work.filter(visible);
  const areas = [...new Set(data.stages.map((s) => s.area))].map((area) => ({
    area,
    label: data.stages.find((s) => s.area === area)?.areaLabel ?? area,
    stages: data.stages.filter((s) => s.area === area && (!blockedOnly || rows.some((r) => r.handoff === s.handoff))),
  }));
  const blockedNow = data.work.filter((w) => w.state === 'blocked').length;

  return (
    <>
      {blockedOnly ? (
        rows.length === 0 ? (
          <p>
            Nothing is blocked. <Link href={`/projects/${projectId}/board`}>All work</Link>
          </p>
        ) : (
          <p>{blockedLine(blockedNow)}</p>
        )
      ) : data.work.length === 0 ? (
        <p>Nothing is on the board yet. Work joins it when someone sends it for review, or when a director or producer adds it with Add work.</p>
      ) : (
        <p>{countLine(data.work)}</p>
      )}
      <p role="status" aria-live="polite" data-updates="" className="updates">
        {status}
      </p>
      {areas
        .filter((a) => a.stages.length > 0)
        .map((a) => (
          <section key={a.area} aria-labelledby={`area-${a.area}`}>
            <h2 id={`area-${a.area}`}>{a.label}</h2>
            {a.area === 'builds-and-operations' ? <p className="hint">{BUILDS_NOTE}</p> : null}
            {a.stages.map((s) => {
              const work = rows.filter((r) => r.handoff === s.handoff);
              const all = data.work.filter((r) => r.handoff === s.handoff);
              return (
                <section key={s.handoff} aria-labelledby={`stage-${s.handoff}`} className="stage">
                  <h3 id={`stage-${s.handoff}`}>{s.label}</h3>
                  <p>
                    {s.decidedBy} {stageLine(blockedOnly ? work : all)}
                  </p>
                  {work.length ? (
                    <table>
                      <caption className="visually-hidden">Work at {s.label}</caption>
                      <thead>
                        <tr>
                          <th scope="col">Work</th>
                          <th scope="col">Owner</th>
                          <th scope="col">State</th>
                          <th scope="col">Latest version</th>
                        </tr>
                      </thead>
                      <tbody>
                        {work.map((w) => (
                          <tr key={w.id}>
                            <th scope="row">
                              <Link href={`/projects/${projectId}/board/${w.id}`}>{w.title}</Link>
                              {changed[w.id] ? <span className="tag"> Changed {changed[w.id]}</span> : null}
                            </th>
                            <td data-label="Owner">{w.owner}</td>
                            <td data-label="State">
                              <strong>{stateLabel(w.state)}</strong>
                              <br />
                              {w.detail}
                              {w.blockingStage ? (
                                <>
                                  {' '}
                                  <span className="tag">Blocking</span> {w.blockingStage} waits on this decision.
                                </>
                              ) : null}
                            </td>
                            <td data-label="Latest version">{w.latest}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </section>
              );
            })}
          </section>
        ))}
    </>
  );
}
