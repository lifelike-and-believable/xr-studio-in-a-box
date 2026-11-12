import type { Metadata } from 'next';
import Link from 'next/link';
import { openOrganisation } from '@/ui/organisation-access';
import { SamplesView, samplesNotice, type SamplesSearch } from '@/ui/samples-view';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<SamplesSearch> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lead = samplesNotice({ kind: 'organisation', id: (await params).id }, await searchParams)?.split('. ')[0]?.replace(/\.$/, '');
  return { title: lead ? `${lead} - Standard work samples` : 'Standard work samples' };
}

// An organisation's standard work samples, for the people who look after it (layer1-facts-identifiers-activity#AC-17).
export default async function StandardWorkSamples({ params, searchParams }: Props) {
  const { id } = await params;
  const { owner, access } = await openOrganisation(id, `/organisations/${id}/work-samples`, 'steward');
  return (
    <main id="main">
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link> &gt; Organisation facts
      </p>
      <h1>Standard work samples</h1>
      <SamplesView
        owner={owner}
        name={access.ownerName}
        api={`/api/v1/organisations/${id}`}
        canEdit
        zone={await viewerZone()}
        search={await searchParams}
        intro={<p className="lead">The company&apos;s showreel, press pack and other samples that every project in the organisation can use.</p>}
      />
    </main>
  );
}
