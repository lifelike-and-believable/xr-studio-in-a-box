import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { openProject } from '@/ui/project-access';
import { AddForm } from './add-form';

export const metadata: Metadata = { title: 'Add a person' };

export default async function AddPerson({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { view } = await openProject(id, `/projects/${id}/people/new`);
  if (view.state !== 'open') return null;
  if (!view.can.has('manage-people')) notFound();
  return (
    <section aria-labelledby="add-title">
      <h2 id="add-title">Add a person</h2>
      <AddForm projectId={id} />
    </section>
  );
}
