import 'server-only';
import { notFound } from 'next/navigation';
import { accessFor } from '@/record/facts';
import { requirePerson } from './session';

// Opens an organisation's slice 2 page for the signed-in person, or the not-available page.
export async function openOrganisation(id: string, path: string, need: 'see' | 'steward' = 'see') {
  const me = await requirePerson(path);
  const owner = { kind: 'organisation' as const, id };
  const access = await accessFor(me.person.id, owner);
  if (!access || (need === 'steward' && !access.steward)) notFound();
  return { me, owner, access };
}
