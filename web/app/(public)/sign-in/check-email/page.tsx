import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { signInRequestById } from '@/record/sign-in';
import { Notice } from '@/ui/notice';
import { another } from '../actions';

export const metadata: Metadata = { title: 'Check your email' };

// The same page whether or not the address can sign in, so it does not tell anyone who is on a
// project (layer1-organisations-projects-people#AC-1).
export default async function CheckEmail({ searchParams }: { searchParams: Promise<{ request?: string; sent?: string }> }) {
  const { request, sent } = await searchParams;
  const found = request ? await signInRequestById(request) : undefined;
  if (!found) notFound();
  return (
    <main id="main">
      <h1>Check your email</h1>
      {sent ? <Notice>If this address can sign in, we have sent another link.</Notice> : null}
      <p>If {found.email} can sign in to XR Studio, we have sent it a sign-in link. Open it on the device you want to use. It works once, for 15 minutes.</p>
      <h2>If the email does not arrive</h2>
      <ul>
        <li>Wait a few minutes, and check your spam or junk folder.</li>
        <li>Check that this is the address the person who added you used.</li>
        <li>If you expect to be on a project, ask its producer or director to add you.</li>
      </ul>
      <div className="actions">
        <form action={another}>
          <input type="hidden" name="request" value={found.id} />
          <button type="submit" className="secondary">
            Send another link
          </button>
        </form>
        <Link href="/sign-in">Use a different email address</Link>
      </div>
    </main>
  );
}
