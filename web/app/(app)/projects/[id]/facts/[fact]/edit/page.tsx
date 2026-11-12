import { factLabel, factNoun, isFunderFact, type Fact } from '@xr/contracts';
import type { Metadata } from 'next';
import { EditFact, openFact } from '@/ui/fact-pages';
import { openProject } from '@/ui/project-access';

type Props = { params: Promise<{ id: string; fact: string }>; searchParams: Promise<{ restore?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fact } = await params;
  return { title: `Edit ${factNoun(fact as Fact)}` };
}

// Edit one project fact (layer1-facts-identifiers-activity#AC-2, AC-3, AC-8, AC-21).
export default async function EditProjectFact({ params, searchParams }: Props) {
  const { id, fact } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/facts/${fact}/edit`);
  if (view.state !== 'open') return null;
  const owner = { kind: 'project' as const, id };
  const open = await openFact(me.person.id, owner, fact, true);
  return (
    <section aria-labelledby="edit-title">
      <h2 id="edit-title">{isFunderFact(open.fact) ? factLabel(open.fact) : `Edit ${factNoun(open.fact)}`}</h2>
      <EditFact owner={owner} fact={open.fact} restore={(await searchParams).restore} />
    </section>
  );
}
