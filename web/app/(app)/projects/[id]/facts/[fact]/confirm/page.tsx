import type { Metadata } from 'next';
import { ConfirmFact, openFact } from '@/ui/fact-pages';
import { openProject } from '@/ui/project-access';

type Props = { params: Promise<{ id: string; fact: string }> };

export const metadata: Metadata = { title: 'Confirm it is not an identifier' };

// Confirm text in a project fact is not an identifier (layer1-facts-identifiers-activity#AC-23).
export default async function ConfirmProjectFact({ params }: Props) {
  const { id, fact } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/facts/${fact}/confirm`);
  if (view.state !== 'open') return null;
  const owner = { kind: 'project' as const, id };
  const open = await openFact(me.person.id, owner, fact, true);
  return (
    <section aria-label="Confirm">
      <ConfirmFact owner={owner} fact={open.fact} />
    </section>
  );
}
