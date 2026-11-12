import 'server-only';
import { EmailSchema } from '@xr/contracts';
import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { auth, linkCapture } from '../auth/auth';
import { db } from '../db/client';
import { invitation, person, project, signInRequest, verification } from '../db/schema';
import { addedEmail, invitationEmail } from '../mail/templates';
import { hashToken, type AddedPerson } from './commands';
import { canSignIn, personByEmail } from './eligibility';
import { newId } from './ids';
import { sendLimited, sentWithinAMinute, type SendOutcome } from './mail';
import { firstAddresses } from './settings';

export const EMAIL_ERROR = 'Enter an email address, like name@example.com.';

// A return address is used only if it is a path on this site (layer1-organisations-projects-people#AC-4).
export function safeReturn(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  return next;
}

// Makes sure a person who may use the dashboard has an auth account, so their links can sign
// them in while sign-up stays closed.
export async function ensureAccount(email: string, name: string | null): Promise<void> {
  const ctx = await auth().$context;
  const existing = await ctx.internalAdapter.findUserByEmail(email);
  const user = existing?.user ?? (await ctx.internalAdapter.createUser({ email, name: name ?? '', emailVerified: true }, { method: 'magic-link' }));
  const found = await personByEmail(email);
  if (found) {
    if (!found.authUserId) await db().update(person).set({ authUserId: user.id }).where(eq(person.id, found.id));
  } else {
    await db().insert(person).values({ id: newId(), email, name, authUserId: user.id });
  }
}

async function sendSignInLink(email: string, requestId: string, next: string, headers: Headers): Promise<void> {
  if (!(await canSignIn(email))) return;
  if (await sentWithinAMinute(email)) return;
  // A first address signs in before anyone has added it, so its account is made now.
  if (firstAddresses().has(email)) await ensureAccount(email, null);
  // Asking for a new link stops every older sign-in link for the address (AC-2).
  await db()
    .delete(verification)
    .where(and(sql`${verification.identifier} like 'magic-link:%'`, sql`${verification.value}::jsonb->>'email' = ${email}`));
  await auth().api.signInMagicLink({
    body: {
      email,
      callbackURL: next,
      errorCallbackURL: `/sign-in/no-longer-works?request=${requestId}`,
    },
    headers,
  });
}

// The neutral request behind **Email me a sign-in link** (AC-1): the same answer whether or not
// the address can sign in.
export async function requestSignInLink(
  rawEmail: string,
  next: string | undefined,
  headers: Headers,
): Promise<{ ok: true; requestId: string } | { ok: false; error: string }> {
  const parsed = EmailSchema.safeParse(rawEmail);
  if (!parsed.success) return { ok: false, error: EMAIL_ERROR };
  const email = parsed.data;
  const requestId = newId();
  const returnTo = safeReturn(next);
  await db().insert(signInRequest).values({ id: requestId, email, returnTo });
  await sendSignInLink(email, requestId, returnTo, headers);
  return { ok: true, requestId };
}

export async function signInRequestById(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return undefined;
  const rows = await db().select().from(signInRequest).where(eq(signInRequest.id, id)).limit(1);
  return rows[0];
}

// **Send another link**: to the same address as the earlier request (AC-2, AC-3).
export async function sendAnotherLink(requestId: string, headers: Headers): Promise<string | null> {
  const earlier = await signInRequestById(requestId);
  if (!earlier) return null;
  const result = await requestSignInLink(earlier.email, earlier.returnTo ?? '/', headers);
  return result.ok ? result.requestId : null;
}

// Opening an invitation (AC-5): a valid link is used up, then signs the person in through a
// sign-in link the app takes for itself, and opens the project.
export async function openInvitation(token: string, headers: Headers): Promise<string> {
  const rows = await db()
    .select({ invitation, email: person.email })
    .from(invitation)
    .innerJoin(person, eq(person.id, invitation.personId))
    .where(eq(invitation.tokenHash, hashToken(token)))
    .limit(1);
  const found = rows[0];
  const noLongerWorks = async () => {
    if (!found) return '/sign-in/no-longer-works';
    const requestId = newId();
    await db().insert(signInRequest).values({ id: requestId, email: found.email, returnTo: `/projects/${found.invitation.projectId}` });
    return `/sign-in/no-longer-works?request=${requestId}`;
  };
  if (!found) return noLongerWorks();
  const used = await db()
    .update(invitation)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(invitation.id, found.invitation.id),
        isNull(invitation.usedAt),
        isNull(invitation.replacedAt),
        gt(invitation.expiresAt, new Date()),
      ),
    )
    .returning({ projectId: invitation.projectId });
  const projectId = used[0]?.projectId;
  if (!projectId || !(await canSignIn(found.email))) return noLongerWorks();
  const capture: { url?: string } = {};
  await linkCapture.run(capture, () =>
    auth().api.signInMagicLink({
      body: { email: found.email, callbackURL: `/projects/${projectId}`, errorCallbackURL: '/sign-in/no-longer-works' },
      headers,
    }),
  );
  return capture.url ?? (await noLongerWorks());
}

export type MailOutcome = SendOutcome | 'none';

// After an add-person command has committed: make the account if needed, then send what the
// person gets (AC-30). A failed email leaves the person added (AC-34).
export async function sendAddedMail(
  added: AddedPerson,
  context: { projectId: string; adder: string; origin: string },
): Promise<MailOutcome> {
  if (added.outcome === 'none') return 'none';
  const projectRow = (await db().select({ name: project.name }).from(project).where(eq(project.id, context.projectId)).limit(1))[0];
  const projectName = projectRow?.name ?? '';
  if (added.outcome === 'added') {
    return sendLimited(
      added.email,
      'added',
      addedEmail({ project: projectName, adder: context.adder, roles: added.roles, link: `${context.origin}/projects/${context.projectId}` }),
    );
  }
  if (added.needsAccount) await ensureAccount(added.email, added.display === added.email ? null : added.display);
  return sendInvitation(added.email, added.invitationToken ?? '', { ...context, projectName, roles: added.roles });
}

export async function sendInvitation(
  email: string,
  token: string,
  context: { projectName: string; adder: string; origin: string; roles: AddedPerson['roles'] },
): Promise<SendOutcome> {
  return sendLimited(
    email,
    'invitation',
    invitationEmail({
      project: context.projectName,
      adder: context.adder,
      roles: context.roles,
      link: `${context.origin}/api/v1/invitations/${token}`,
      appUrl: context.origin,
    }),
  );
}
