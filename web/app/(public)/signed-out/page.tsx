import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'You are signed out' };

export default function SignedOut() {
  return (
    <main id="main">
      <h1>You are signed out</h1>
      <p>
        <Link href="/sign-in">Sign in again</Link>
      </p>
    </main>
  );
}
