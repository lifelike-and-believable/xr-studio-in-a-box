import { AREAS, handoffById, isAreaId } from '@xr/contracts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { approverChoices, approversOf } from '@/record/review';
import { openProject } from '@/ui/project-access';
import { AreaForm } from '../approver-form';

type Props = { params: Promise<{ id: string; area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const found = AREAS.find((a) => a.id === area);
  return { title: found ? `${found.label}: approver and delegate` : 'Approvers' };
}

const covers = (handoffs: string[]) => {
  const labels = handoffs.map((h, i) => {
    const label = handoffById(h)?.label ?? h;
    return i === 0 || /^[A-Z]{2}/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1);
  });
  return labels.length <= 1 ? labels.join('') : `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`;
};

export default async function ChangeArea({ params }: Props) {
  const { id, area } = await params;
  const { view } = await openProject(id, `/projects/${id}/approvers/${area}`);
  if (view.state !== 'open') return null;
  if (!view.can.has('manage-gates') || !isAreaId(area)) notFound();
  const current = (await approversOf(id)).areas.find((a) => a.area === area);
  const found = AREAS.find((a) => a.id === area);
  if (!current || !found) notFound();
  return (
    <>
      <h2 id="area-title">{found.label}: approver and delegate</h2>
      <p className="lead">
        {found.label} covers {covers(found.handoffs)}.
      </p>
      <AreaForm
        projectId={id}
        area={area}
        label={found.label}
        choices={await approverChoices(id)}
        approver={current.approver?.id ?? ''}
        delegate={current.delegate?.id ?? ''}
      />
    </>
  );
}
