import type { Metadata } from 'next';
import Link from 'next/link';
import { ActivityView, activityTitle, type ActivitySearch } from '@/ui/activity-view';
import { openOrganisation } from '@/ui/organisation-access';
import { viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<ActivitySearch> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return { title: await activityTitle({ kind: 'organisation', id: (await params).id }, await viewerZone(), await searchParams) };
}

// An organisation's activity, for the people who look after it (layer1-facts-identifiers-activity#AC-37).
export default async function OrganisationActivity({ params, searchParams }: Props) {
  const { id } = await params;
  const { owner, access } = await openOrganisation(id, `/organisations/${id}/activity`, 'steward');
  return (
    <main id="main">
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link>
      </p>
      <h1>{access.ownerName}</h1>
      <ActivityView owner={owner} path={`/organisations/${id}/activity`} zone={await viewerZone()} search={await searchParams} />
    </main>
  );
}
