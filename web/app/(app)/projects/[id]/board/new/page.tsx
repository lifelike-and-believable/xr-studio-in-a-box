import { AREAS, handoffById, handoffsByHand } from '@xr/contracts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { approverChoices, sendFormFor } from '@/record/review';
import { openProject } from '@/ui/project-access';
import { AddWorkForm } from './add-work-form';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Add work' };

// **Add work**, for the director and producer (layer1-versions-board-first-view#AC-12 to AC-14,
// AC-17).
export default async function AddWork({ params }: Props) {
  const { id } = await params;
  const { view } = await openProject(id, `/projects/${id}/board/new`);
  if (view.state !== 'open') return null;
  if (!view.can.has('plan-work')) notFound();
  const byHand = new Set(handoffsByHand().map((h) => h.id));
  const stages = AREAS.map((a) => ({ area: a.label, stages: a.handoffs.filter((h) => byHand.has(h)).map((h) => ({ id: h, label: handoffById(h)?.label ?? h })) })).filter(
    (g) => g.stages.length > 0,
  );
  return (
    <section aria-labelledby="add-title">
      <h2 id="add-title">Add work</h2>
      <p className="lead">Put a piece of work on the board before anyone sends it, so its owner sees it under What needs you.</p>
      <AddWorkForm projectId={id} stages={stages} owners={await approverChoices(id)} whoDecides={await sendFormFor(id)} />
    </section>
  );
}
