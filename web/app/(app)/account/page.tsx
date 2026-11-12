import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { auth } from '@/auth/auth';
import { Notice } from '@/ui/notice';
import { requirePerson } from '@/ui/session';
import { removePasskey } from './actions';
import { AddPasskey } from './add-passkey';

type Props = { searchParams: Promise<{ notice?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { notice } = await searchParams;
  return { title: notice === 'passkey-removed' ? { absolute: 'Passkey removed - XR Studio' } : 'Your account' };
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// **Your account**: passkeys (layer1-organisations-projects-people#AC-7).
export default async function Account({ searchParams }: Props) {
  const me = await requirePerson('/account');
  const { notice } = await searchParams;
  const passkeys = await auth().api.listPasskeys({ headers: await headers() });
  return (
    <main id="main">
      {notice === 'passkey-removed' ? <Notice>Passkey removed. You can no longer use it to sign in.</Notice> : null}
      <h1>Your account</h1>
      <p>Signed in as {me.person.email}.</p>
      <h2>Passkeys</h2>
      <p className="hint">A passkey lets you sign in on a device without waiting for an email. Your browser or password manager keeps it.</p>
      {passkeys.length === 0 ? <p>You have no passkeys yet.</p> : null}
      <ul>
        {passkeys.map((p) => (
          <li key={p.id}>
            {p.name ?? 'Passkey'}. Made on {p.createdAt ? dateFormat.format(new Date(p.createdAt)) : 'an unknown date'}.{' '}
            <form action={removePasskey} style={{ display: 'inline' }}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="link">
                Remove<span className="visually-hidden"> {p.name ?? 'passkey'}</span>
              </button>
            </form>
          </li>
        ))}
      </ul>
      <AddPasskey />
    </main>
  );
}
