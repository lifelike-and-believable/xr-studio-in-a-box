import { handoffById } from '@xr/contracts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isId } from '@/record/ids';
import { workFor } from '@/record/work';
import { openProject } from '@/ui/project-access';
import { ReviewPreview } from '@/ui/review-preview';
import { entryTime, viewerZone } from '@/ui/time';
import { andList, decisionCell, deciderNames } from '@/ui/work-view';
import { RestoreDialog } from '../../restore-dialog';
import { CompareError } from './compare-error';

type Props = { params: Promise<{ id: string; workId: string }>; searchParams: Promise<{ a?: string; b?: string }> };

export const metadata: Metadata = { title: 'Compare versions - Board' };

const orList = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`);

// **Compare versions**: two whole versions side by side, stacked at phone width
// (layer1-versions-board-first-view#AC-28, AC-29).
export default async function Compare({ params, searchParams }: Props) {
  const { id, workId } = await params;
  const search = await searchParams;
  const { view } = await openProject(id, `/projects/${id}/board/${workId}/compare`);
  if (view.state !== 'open') return null;
  const w = isId(workId) ? await workFor(id, workId) : null;
  if (!w) notFound();
  const zone = await viewerZone();
  const back = `/projects/${id}/board/${w.id}`;
  const heading = <h2 id="compare-title">Compare versions of {w.title}</h2>;
  if (w.versions.length < 2) {
    return (
      <section>
        {heading}
        <p>
          {w.title} has one version so far. You can compare versions once a second one is sent.
        </p>
        <p>
          <Link href={back}>Back to {w.title}</Link>
        </p>
      </section>
    );
  }
  const numbers = w.versions.map((v) => v.version).sort((x, y) => x - y);
  const [newest, before] = [w.versions[0]?.version ?? 0, w.versions[1]?.version ?? 0];
  const a = Number(search.a);
  const b = Number(search.b);
  const same = numbers.includes(a) && a === b;
  // A version that does not exist shows the latest two.
  const pair = numbers.includes(a) && numbers.includes(b) && a !== b ? [Math.min(a, b), Math.max(a, b)] : [before, newest];
  const waiting = w.versions[0]?.state === 'waiting';
  const deciders = deciderNames(w.deciders);
  const handoff = handoffById(w.handoff);
  const file = (itemId: string) => `/api/v1/projects/${id}/review-items/${itemId}/file`;
  return (
    <section>
      <p>
        <Link href={back}>{w.title}</Link>
      </p>
      {heading}
      {same ? <CompareError /> : null}
      <form method="get" className="filters">
        <div className="filter-row">
          <div className="field">
            <label htmlFor="a">Compare version</label>
            <select id="a" name="a" defaultValue={String(same ? a : pair[0])} aria-describedby={same ? 'compare-error' : undefined}>
              {numbers.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="b">with version</label>
            <select id="b" name="b" defaultValue={String(same ? b : pair[1])} aria-describedby={same ? 'compare-error' : undefined}>
              {numbers.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="actions">
          <button type="submit">Compare</button>
        </div>
      </form>
      {same ? null : (
        <div className="version-pair">
          {pair.map((n) => {
            const v = w.versions.find((x) => x.version === n);
            if (!v) return null;
            const said = v.decision && v.decision.decision !== 'withdraw' ? v.decision.feedback : '';
            const later = w.versions.filter((x) => x.version > n).map((x) => x.version).reverse();
            return (
              <section key={n} aria-labelledby={`v-${n}`}>
                <h3 id={`v-${n}`}>Version {n}</h3>
                {v.file ? (
                  <>
                    <ReviewPreview src={file(v.itemId)} file={v.file} large />
                    <p>
                      <a href={file(v.itemId)}>Open the file, version {n}</a>
                    </p>
                  </>
                ) : null}
                <dl className="meta">
                  <dt>Sent by</dt>
                  <dd>
                    {v.sentBy.display}, {entryTime(v.sentAt, zone)}
                  </dd>
                  <dt>What changed</dt>
                  <dd>{v.whatChanged}</dd>
                  <dt>Decision</dt>
                  <dd>{decisionCell(v, zone)}</dd>
                </dl>
                {said ? <p className="quote">{said}</p> : null}
                {n !== newest && !waiting ? (
                  <RestoreDialog
                    projectId={id}
                    workId={w.id}
                    title={w.title}
                    version={n}
                    next={newest + 1}
                    stage={handoff?.label ?? w.handoff}
                    deciders={orList(deciders)}
                    seers={andList(deciders)}
                    kept={later.length === 1 ? `Version ${later[0]} is kept, with its feedback.` : `Versions ${andList(later.map(String))} are kept, with their feedback.`}
                  />
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
