import 'server-only';
import { notFound } from 'next/navigation';
import { projectFor } from '@/record/queries';
import { requirePerson } from './session';

// Opens a project for the signed-in person, or answers as the record says: not available (the
// same 404 as a missing page) or access removed (layer1-organisations-projects-people#AC-16).
export async function openProject(id: string, path: string) {
  const me = await requirePerson(path);
  const view = await projectFor(me.person.id, id);
  if (view.state === 'not-available') notFound();
  return { me, view };
}
