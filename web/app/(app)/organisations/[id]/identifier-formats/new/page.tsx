import type { Metadata } from 'next';
import Link from 'next/link';
import { AddFormatForm } from '@/ui/add-format-form';
import { openOrganisation } from '@/ui/organisation-access';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: 'Add a format' };

// Add an identifier format (layer1-facts-identifiers-activity#AC-28).
export default async function AddFormat({ params }: Props) {
  const { id } = await params;
  const { access } = await openOrganisation(id, `/organisations/${id}/identifier-formats/new`, 'steward');
  return (
    <main id="main">
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link> &gt; <Link href={`/organisations/${id}/identifier-formats`}>Identifier formats</Link>
      </p>
      <h1>Add a format</h1>
      <AddFormatForm organisationId={id} />
    </main>
  );
}
