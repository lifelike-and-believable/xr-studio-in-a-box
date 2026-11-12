import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { accessFor } from '@/record/facts';
import { ActivityView, activityTitle, type ActivitySearch } from '@/ui/activity-view';
import { openProject } from '@/ui/project-access';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<ActivitySearch> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return { title: await activityTitle({ kind: 'project', id: (await params).id }, await viewerZone(), await searchParams) };
}

// A project's activity, for the Director, Producer and Technical artist (layer1-facts-identifiers-activity#AC-34).
export default async function ProjectActivity({ params, searchParams }: Props) {
  const { id } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/activity`);
  if (view.state !== 'open') return null;
  const owner = { kind: 'project' as const, id };
  if (!(await accessFor(me.person.id, owner))?.readsActivity) notFound();
  return <ActivityView owner={owner} path={`/projects/${id}/activity`} zone={await viewerZone()} search={await searchParams} />;
}
