import 'server-only';
import { AsyncLocalStorage } from 'node:async_hooks';
import { and, gt, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { emailSend } from '../db/schema';
import { deliver } from '../mail/transport';
import type { MailContent } from '../mail/templates';
import { newId } from './ids';

export type SendOutcome = 'sent' | 'limited' | 'failed';

type Tx = Parameters<Parameters<ReturnType<typeof db>['transaction']>[0]>[0];
type Reader = ReturnType<typeof db> | Tx;

const sameAddress = (address: string) => sql`lower(${emailSend.address}) = ${address.toLowerCase()}`;

// The address whose lock this request already holds, and the transaction holding it.
const held = new AsyncLocalStorage<{ address: string; tx: Tx }>();

// Everything that decides whether an address gets a link runs under one lock per address: the
// one-a-minute check, replacing the earlier link, and recording the send. Without it two
// requests at once could both pass the check, or the second could replace the link the first
// has just emailed (layer1-organisations-projects-people#AC-2, AC-3, AC-31). The lock is a
// transaction-scoped advisory lock; work started inside it reuses the same lock.
export async function withAddressLock<T>(address: string, work: (tx: Tx) => Promise<T>): Promise<T> {
  const key = address.toLowerCase();
  const current = held.getStore();
  if (current?.address === key) return work(current.tx);
  return db().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`mail:${key}`}))`);
    return held.run({ address: key, tx }, () => work(tx));
  });
}

// At most one email a minute goes to an address, whichever action asked for it
// (layer1-organisations-projects-people#AC-3, AC-31).
export async function sentWithinAMinute(address: string, reader: Reader = db()): Promise<boolean> {
  const recent = await reader
    .select({ id: emailSend.id })
    .from(emailSend)
    .where(
      and(
        sameAddress(address),
        inArray(emailSend.kind, ['sign-in', 'invitation']),
        gt(emailSend.sentAt, sql`now() - interval '1 minute'`),
      ),
    )
    .limit(1);
  return recent.length > 0;
}

// The limit covers the emails that carry a link someone can ask for again and again: sign-in
// links and invitations. An "added to a project" email follows one person's add, so it is
// always sent (spec, APIs and assumptions).
const LIMITED = new Set(['sign-in', 'invitation']);

export async function sendLimited(address: string, kind: string, content: MailContent): Promise<SendOutcome> {
  return withAddressLock(address, async (tx) => {
    if (LIMITED.has(kind) && (await sentWithinAMinute(address, tx))) return 'limited';
    try {
      await deliver({ to: address, ...content });
    } catch {
      // The reason can name the transport's settings; the caller only needs to know it failed.
      console.error(`mail: a ${kind} email could not be sent`);
      return 'failed';
    }
    await tx.insert(emailSend).values({ id: newId(), address: address.toLowerCase(), kind });
    return 'sent';
  });
}
