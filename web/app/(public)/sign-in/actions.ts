'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requestSignInLink, sendAnotherLink } from '@/record/sign-in';

export type SignInState = { error?: string; email: string };

export async function requestLink(_prev: SignInState, form: FormData): Promise<SignInState> {
  const email = String(form.get('email') ?? '');
  const result = await requestSignInLink(email, String(form.get('next') ?? '/'), await headers());
  if (!result.ok) return { error: result.error, email };
  redirect(`/sign-in/check-email?request=${result.requestId}`);
}

export async function another(form: FormData): Promise<void> {
  const requestId = await sendAnotherLink(String(form.get('request') ?? ''), await headers());
  redirect(requestId ? `/sign-in/check-email?request=${requestId}&sent=1` : '/sign-in');
}
