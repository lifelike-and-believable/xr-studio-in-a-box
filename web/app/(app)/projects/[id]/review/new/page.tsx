import { AREAS, areaLabel, handoffById, handoffsByHand } from '@xr/contracts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { decidersLine, sendFormFor } from '@/record/review';
import { workFor } from '@/record/work';
import { openProject } from '@/ui/project-access';
import { SendForm, type StageGroup } from './send-form';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ work?: string }> };

export const metadata: Metadata = { title: 'Send for review' };

const groupsOf = (keep: (id: string) => boolean): StageGroup[] =>
  AREAS.map((a) => ({ area: a.label, stages: a.handoffs.filter(keep).map((h) => ({ id: h, label: handoffById(h)?.label ?? h })) })).filter((g) => g.stages.length > 0);

// **Send for review** (layer1-gates-and-queue#AC-13 to AC-18), and for a piece of work its next
// version, with the stage fixed (layer1-versions-board-first-view#AC-26, AC-27).
export default async function SendForReview({ params, searchParams }: Props) {
  const { id } = await params;
  const { work: workId } = await searchParams;
  const { view } = await openProject(id, `/projects/${id}/review/new${workId ? `?work=${workId}` : ''}`);
  if (view.state !== 'open') return null;
  const byHand = new Set(handoffsByHand().map((h) => h.id));
  const found = workId ? await workFor(id, workId) : null;
  if (workId && !found) notFound();
  const handoff = found ? handoffById(found.handoff) : undefined;
  const last = found?.latest ?? null;
  const asked = found?.versions.find((v) => v.decision && v.decision.decision !== 'withdraw' && v.decision.feedback);
  const work = found
    ? {
        id: found.id,
        title: found.title,
        stage: `${handoff?.label ?? found.handoff}${handoff?.area ? ` (${areaLabel(handoff.area)})` : ''}`,
        version: (last?.version ?? 0) + 1,
        decidedBy: decidersLine(found.deciders),
        asked: asked?.decision ? { by: asked.decision.by.display, version: asked.version, feedback: asked.decision.feedback } : null,
      }
    : undefined;
  const heading = found && found.versions.length > 0 ? 'Send a revised version' : 'Send for review';
  return (
    <section aria-labelledby="send-title">
      {found ? <p className="lead">{found.title}</p> : null}
      <h2 id="send-title">{heading}</h2>
      {found ? null : <p className="lead">Send work for approval to the person who decides it. It waits until they accept it.</p>}
      <SendForm
        projectId={id}
        stages={groupsOf((h) => byHand.has(h))}
        waiting={groupsOf(() => true)}
        whoDecides={await sendFormFor(id)}
        start={found ? { title: found.title, handoff: found.handoff, waitingOn: last?.waitingHandoff ?? '' } : { title: '', handoff: '', waitingOn: '' }}
        work={work}
      />
    </section>
  );
}
