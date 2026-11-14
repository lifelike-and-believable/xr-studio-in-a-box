import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { signInAs } from '@/try/sign-in';
import { tryMode } from '@/try/mode';
import { personByFirstName } from '@/try/people';


type Props = { searchParams: Promise<{ as?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const p = tryMode() ? personByFirstName((await searchParams).as ?? '') : undefined;
  return { title: p ? `${p.first} is not added yet` : 'This page is not available' };
}

// Sign in as a person (trying-the-product#AC-12 to AC-14): a selection on Try XR Studio, never a
// prefetch. A person who may sign in is sent through an ordinary one-time sign-in link.
export default async function TrySignInPage({ searchParams }: Props) {
  if (!tryMode()) notFound();
  const outcome = await signInAs((await searchParams).as ?? '', await headers());
  if (outcome.kind === 'not-found') notFound();
  if (outcome.kind === 'go') redirect(outcome.url);
  return (
    <main id="main">
      <h1>{outcome.first} is not added yet</h1>
      <p>
        {outcome.first} is not on a project in this copy yet. Jordan adds {outcome.first} in Start a production and bring in your team.
      </p>
      <p>
        <a href="/try">Try XR Studio</a>
      </p>
    </main>
  );
}
