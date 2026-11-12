import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { organisationFor, stewardChoices } from '@/record/queries';
import { requirePerson } from '@/ui/session';
import { OrganisationForm } from '../../organisation-form';

export const metadata: Metadata = { title: 'Edit organisation' };

export default async function EditOrganisation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requirePerson(`/organisations/${id}/edit`);
  const org = await organisationFor(me.person.id, id);
  if (!org?.looksAfter) notFound();
  const choices = await stewardChoices({ id: me.person.id, display: me.person.display }, org.stewards.map((s) => s.id));
  return (
    <main id="main">
      <h1>Edit organisation</h1>
      <OrganisationForm
        mode="edit"
        organisationId={org.id}
        name={org.name}
        choices={choices}
        stewardIds={org.stewards.map((s) => s.id)}
      />
    </main>
  );
}
