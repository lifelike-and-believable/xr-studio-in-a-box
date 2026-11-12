import type { Metadata } from 'next';
import { startChoices } from '@/record/queries';
import { requirePerson } from '@/ui/session';
import { StartForm } from './start-form';

export const metadata: Metadata = { title: 'Start a project' };

export default async function StartProject({ searchParams }: { searchParams: Promise<{ organisation?: string }> }) {
  const me = await requirePerson('/projects/new');
  const { organisation } = await searchParams;
  const organisations = await startChoices({ id: me.person.id, display: me.person.display });
  return (
    <main id="main">
      <h1>Start a project</h1>
      <StartForm me={{ id: me.person.id, label: `${me.person.display} (you)` }} organisations={organisations} preselect={organisation} />
    </main>
  );
}
