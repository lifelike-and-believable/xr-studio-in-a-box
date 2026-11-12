import { factNoun, type Fact } from '@xr/contracts';
import type { Metadata } from 'next';
import { History, openFact } from '@/ui/fact-pages';
import { openProject } from '@/ui/project-access';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string; fact?: string }>; searchParams: Promise<{ compare?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { fact = 'work-samples' } = await params;
  const { compare } = await searchParams;
  const noun = factNoun(fact as Fact);
  return { title: compare ? `Compare ${noun}: version ${compare} and current` : `Earlier versions of ${noun}` };
}

// One project fact's earlier versions, compare and restore (layer1-facts-identifiers-activity#AC-6, AC-7).
export default async function ProjectFactHistory({ params, searchParams }: Props) {
  const { id, fact = 'work-samples' } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/facts/${fact}/history`);
  if (view.state !== 'open') return null;
  const owner = { kind: 'project' as const, id };
  const open = await openFact(me.person.id, owner, fact, false);
  return <History owner={owner} fact={open.fact} canEdit={open.canEdit} zone={await viewerZone()} compare={(await searchParams).compare} />;
}
