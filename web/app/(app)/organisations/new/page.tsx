import type { Metadata } from 'next';
import { stewardChoices } from '@/record/queries';
import { requirePerson } from '@/ui/session';
import { OrganisationForm } from '../organisation-form';

export const metadata: Metadata = { title: 'Create an organisation' };

export default async function NewOrganisation() {
  const me = await requirePerson('/organisations/new');
  const choices = await stewardChoices({ id: me.person.id, display: me.person.display });
  return (
    <main id="main">
      <h1>Create an organisation</h1>
      <OrganisationForm mode="create" name="" choices={choices} stewardIds={[me.person.id]} />
    </main>
  );
}
