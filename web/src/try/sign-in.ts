import 'server-only';
import { and, desc, eq, gt, isNull } from 'drizzle-orm';
import { db } from '../db/client';
import { invitation, person } from '../db/schema';
import { canSignIn } from '../record/eligibility';
import { firstAddresses } from '../record/settings';
import { acceptInvitation, ensureAccount, takeSignInLink } from '../record/sign-in';
import { tryMode } from './mode';
import { personByFirstName, PEOPLE, type TrialPerson } from './people';
import { isMarked } from './records';

export type SignInAs = { kind: 'not-found' } | { kind: 'not-added'; first: string } | { kind: 'go'; url: string };

// A browser may fetch a link ahead of a selection; such a request never signs anyone in or uses up
// an invitation (trying-the-product#AC-14). Next.js answers its own router's prefetches without
// running the page, and removes their header, so only the browser's are seen here.
export function isPrefetch(headers: Headers): boolean {
  return headers.get('purpose')?.toLowerCase() === 'prefetch' || (headers.get('sec-purpose') ?? '').toLowerCase().includes('prefetch');
}

// The open invitation of a person, if any: not used, not replaced, not expired. Accepting it
// without its link exists only in a trial copy (design-trying-the-product, "Notes for delivery").
async function openInvitationOf(p: TrialPerson) {
  if (!tryMode()) return undefined;
  const rows = await db()
    .select({ invitation, email: person.email })
    .from(invitation)
    .innerJoin(person, eq(person.id, invitation.personId))
    .where(and(eq(person.email, p.email), isNull(invitation.usedAt), isNull(invitation.replacedAt), gt(invitation.expiresAt, new Date())))
    .orderBy(desc(invitation.createdAt))
    .limit(1);
  return rows[0];
}

// Whether each of the five can sign in at this point, for Try XR Studio (trying-the-product#AC-11).
export async function whoCanSignIn(): Promise<Map<string, boolean>> {
  const out = new Map<string, boolean>();
  for (const p of PEOPLE) out.set(p.first, (await canSignIn(p.email)) || (await openInvitationOf(p)) !== undefined);
  return out;
}

// /try/sign-in?as=<first name> (trying-the-product#AC-12, AC-13, AC-14).
export async function signInAs(first: string, headers: Headers): Promise<SignInAs> {
  if (!tryMode() || isPrefetch(headers)) return { kind: 'not-found' };
  const p = personByFirstName(first);
  if (!p || !(await isMarked())) return { kind: 'not-found' };
  const open = await openInvitationOf(p);
  if (open) return { kind: 'go', url: await acceptInvitation(open, headers) };
  if (!(await canSignIn(p.email))) return { kind: 'not-added', first: p.first };
  // A first address signs in before anyone has added it, so its account is made now, as the
  // ordinary sign-in does.
  if (firstAddresses().has(p.email)) await ensureAccount(p.email, null);
  const url = await takeSignInLink(p.email, '/', headers);
  return url ? { kind: 'go', url } : { kind: 'not-found' };
}
