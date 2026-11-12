import 'server-only';
import { and, gt, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { emailSend } from '../db/schema';
import { deliver } from '../mail/transport';
import type { MailContent } from '../mail/templates';
import { newId } from './ids';

export type SendOutcome = 'sent' | 'limited' | 'failed';

const sameAddress = (address: string) => sql`lower(${emailSend.address}) = ${address.toLowerCase()}`;

// At most one email a minute goes to an address, whichever action asked for it
// (layer1-organisations-projects-people#AC-3, AC-31).
export async function sentWithinAMinute(address: string): Promise<boolean> {
  const recent = await db()
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
  if (LIMITED.has(kind) && (await sentWithinAMinute(address))) return 'limited';
  try {
    deliver({ to: address, ...content });
  } catch {
    // The reason can name the transport's settings; the caller only needs to know it failed.
    console.error(`mail: a ${kind} email could not be sent`);
    return 'failed';
  }
  await db().insert(emailSend).values({ id: newId(), address: address.toLowerCase(), kind });
  return 'sent';
}
