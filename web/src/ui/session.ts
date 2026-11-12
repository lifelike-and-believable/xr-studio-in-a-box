import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { signedIn, type SignedIn } from '../record/principal';

// One session read per request, shared by the layout and the page.
export const currentPerson = cache(async (): Promise<SignedIn | null> => signedIn(await headers()));

// Pages that need a signed-in person send everyone else to Sign in, returning here afterwards
// (layer1-organisations-projects-people#AC-4).
export async function requirePerson(path: string): Promise<SignedIn> {
  const me = await currentPerson();
  if (!me) redirect(`/sign-in?next=${encodeURIComponent(path)}`);
  return me;
}
