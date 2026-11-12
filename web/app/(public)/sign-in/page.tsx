import type { Metadata } from 'next';
import { safeReturn } from '@/record/sign-in';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main id="main">
      <h1>Sign in</h1>
      <p>XR Studio has no passwords. We email you a link that signs you in.</p>
      <SignInForm next={safeReturn(next)} />
    </main>
  );
}
