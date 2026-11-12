import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { openProject } from '@/ui/project-access';
import { EditForm } from './edit-form';

export const metadata: Metadata = { title: 'Edit name and brief' };

// Only the project's Director or Producer can open this (layer1-organisations-projects-people#AC-22).
export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { view } = await openProject(id, `/projects/${id}/edit`);
  if (view.state !== 'open') return null;
  if (!view.can.has('edit-project')) notFound();
  return (
    <section aria-labelledby="edit-title">
      <h2 id="edit-title">Edit name and brief</h2>
      <EditForm id={id} name={view.project.name} brief={view.project.brief} />
    </section>
  );
}
