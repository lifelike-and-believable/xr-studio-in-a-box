import { AREAS, handoffById, handoffsByHand } from '@xr/contracts';
import type { Metadata } from 'next';
import { isId } from '@/record/ids';
import { itemFor, sendFormFor } from '@/record/review';
import { openProject } from '@/ui/project-access';
import { SendForm, type StageGroup } from './send-form';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> };

export const metadata: Metadata = { title: 'Send for review' };

const groupsOf = (keep: (id: string) => boolean): StageGroup[] =>
  AREAS.map((a) => ({ area: a.label, stages: a.handoffs.filter(keep).map((h) => ({ id: h, label: handoffById(h)?.label ?? h })) })).filter((g) => g.stages.length > 0);

// **Send for review** (layer1-gates-and-queue#AC-13 to AC-18, AC-35).
export default async function SendForReview({ params, searchParams }: Props) {
  const { id } = await params;
  const { from } = await searchParams;
  const { me, view } = await openProject(id, `/projects/${id}/review/new`);
  if (view.state !== 'open') return null;
  const byHand = new Set(handoffsByHand().map((h) => h.id));
  // **Send a revised version** and **Send it again** fill in the earlier item's title, stage and
  // waiting choice; only for the person who sent it.
  const earlier = from && isId(from) ? await itemFor(id, from) : null;
  const start = earlier && earlier.requester.id === me.person.id ? { title: earlier.title, handoff: earlier.handoff, waitingOn: earlier.waitingHandoff ?? '' } : null;
  return (
    <section aria-labelledby="send-title">
      <h2 id="send-title">Send for review</h2>
      <p className="lead">Send work for approval to the person who decides it. It waits until they accept it.</p>
      <SendForm
        projectId={id}
        stages={groupsOf((h) => byHand.has(h))}
        waiting={groupsOf(() => true)}
        whoDecides={await sendFormFor(id)}
        start={start ?? { title: '', handoff: '', waitingOn: '' }}
      />
    </section>
  );
}
