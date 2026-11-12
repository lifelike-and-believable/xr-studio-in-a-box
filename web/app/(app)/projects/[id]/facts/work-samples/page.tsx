import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { accessFor } from '@/record/facts';
import { openProject } from '@/ui/project-access';
import { SamplesView, samplesNotice, type SamplesSearch } from '@/ui/samples-view';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<SamplesSearch> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lead = samplesNotice({ kind: 'project', id: (await params).id }, await searchParams)?.split('. ')[0]?.replace(/\.$/, '');
  return { title: lead ? `${lead} - Work samples` : 'Work samples' };
}

// A project's work samples, for its Director and Producer (layer1-facts-identifiers-activity#AC-9).
export default async function ProjectWorkSamples({ params, searchParams }: Props) {
  const { id } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/facts/work-samples`);
  if (view.state !== 'open') return null;
  const owner = { kind: 'project' as const, id };
  const access = await accessFor(me.person.id, owner);
  if (!access?.canEdit) notFound();
  return (
    <section aria-labelledby="samples-title">
      <h2 id="samples-title">Work samples</h2>
      <SamplesView
        owner={owner}
        name={access.ownerName}
        api={`/api/v1/projects/${id}`}
        canEdit
        zone={await viewerZone()}
        search={await searchParams}
        intro={
          <p className="lead">
            This project&apos;s own samples. The organisation&apos;s standard samples are on{' '}
            <Link href={`/organisations/${access.organisationId}`}>{access.organisationName}&apos;s facts</Link>.
          </p>
        }
      />
    </section>
  );
}
