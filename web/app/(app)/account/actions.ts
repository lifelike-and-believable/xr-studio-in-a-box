'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth/auth';

export async function removePasskey(form: FormData): Promise<void> {
  await auth().api.deletePasskey({ body: { id: String(form.get('id') ?? '') }, headers: await headers() });
  revalidatePath('/account');
  redirect('/account?notice=passkey-removed');
}
