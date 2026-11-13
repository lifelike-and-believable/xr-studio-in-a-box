import { isProtectedId, protectedLabel } from '@xr/contracts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { approverChoices, approversOf } from '@/record/review';
import { openProject } from '@/ui/project-access';
import { HolderForm } from '../../approver-form';

type Props = { params: Promise<{ id: string; approval: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { approval } = await params;
  return { title: isProtectedId(approval) ? `${protectedLabel(approval)}: holder` : 'Approvers' };
}

export default async function ChangeHolder({ params }: Props) {
  const { id, approval } = await params;
  const { view } = await openProject(id, `/projects/${id}/approvers/protected/${approval}`);
  if (view.state !== 'open') return null;
  if (!view.can.has('manage-gates') || !isProtectedId(approval)) notFound();
  const label = protectedLabel(approval);
  const current = (await approversOf(id)).protected.find((p) => p.approval === approval);
  return (
    <>
      <h2 id="holder-title">{label}: holder</h2>
      <p className="lead">
        The holder decides every item at the {label.toLowerCase()} hand-off. It is one of the four protected approvals: only a named person can hold it, never an AI, and the holder cannot hand items on.
      </p>
      <HolderForm projectId={id} approval={approval} label={label} choices={await approverChoices(id)} holder={current?.holder?.id ?? ''} />
    </>
  );
}
