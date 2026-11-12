import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { managers, orList, personOn } from '@/record/queries';
import { openProject } from '@/ui/project-access';
import { RolesForm } from './roles-form';

type Props = { params: Promise<{ id: string; personId: string }> };

export const metadata: Metadata = { title: 'Change roles or remove' };

export default async function PersonRoles({ params }: Props) {
  const { id, personId } = await params;
  const { me, view } = await openProject(id, `/projects/${id}/people/${personId}`);
  if (view.state !== 'open') return null;
  if (!view.can.has('manage-people')) notFound();
  const { people, target } = await personOn(id, personId);
  if (!target) notFound();
  const others = managers(people).filter((p) => p.id !== target.id);
  return (
    <section aria-labelledby="roles-title">
      <h2 id="roles-title">Change roles or remove {target.display}</h2>
      <RolesForm
        projectId={id}
        personId={target.id}
        display={target.display}
        roles={target.roles}
        self={target.id === me.person.id}
        lastManager={others.length === 0 && managers([target]).length === 1}
        otherManagers={orList(others.map((p) => p.display))}
      />
    </section>
  );
}
