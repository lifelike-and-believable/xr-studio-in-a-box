import type { Metadata } from 'next';
import Link from 'next/link';
import { signInRequestById } from '@/record/sign-in';
import { another } from '../actions';

export const metadata: Metadata = { title: 'This sign-in link no longer works' };

// A used, expired or replaced link (layer1-organisations-projects-people#AC-2, AC-5).
export default async function NoLongerWorks({ searchParams }: { searchParams: Promise<{ request?: string }> }) {
  const { request } = await searchParams;
  const found = request ? await signInRequestById(request) : undefined;
  return (
    <main id="main">
      <h1>This sign-in link no longer works</h1>
      <p>It was already used, it has expired, or a newer link was sent.</p>
      <div className="actions">
        {found ? (
          <form action={another}>
            <input type="hidden" name="request" value={found.id} />
            <button type="submit">Send another link</button>
          </form>
        ) : null}
        <Link href="/sign-in">Use a different email address</Link>
      </div>
    </main>
  );
}
