import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { tryMail } from '../db/schema';
import { keepTrialMail } from '../record/commands';
import { isId } from '../record/ids';
import type { OutgoingMail } from '../mail/transport';

export type KeptMail = OutgoingMail & { id: string; sentAt: Date };

// The email stand-in of a trial copy (trying-the-product#AC-16): kept, never delivered.
export async function keepMail(mail: OutgoingMail): Promise<void> {
  await keepTrialMail(mail);
}

const fields = { id: tryMail.id, to: tryMail.address, subject: tryMail.subject, text: tryMail.text, sentAt: tryMail.sentAt };

export async function listMail(): Promise<KeptMail[]> {
  return db().select(fields).from(tryMail).orderBy(desc(tryMail.sentAt), desc(tryMail.id));
}

export async function mailById(id: string): Promise<KeptMail | undefined> {
  if (!isId(id)) return undefined;
  return (await db().select(fields).from(tryMail).where(eq(tryMail.id, id)).limit(1))[0];
}
