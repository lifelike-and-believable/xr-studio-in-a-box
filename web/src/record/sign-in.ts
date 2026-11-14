import 'server-only';
import { EmailSchema } from '@xr/contracts';
import { and, eq, gt, isNull, lt, sql } from 'drizzle-orm';
import { auth, linkCapture } from '../auth/auth';
import { db } from '../db/client';
import { invitation, person, project, signInRequest, verification } from '../db/schema';
import { addedEmail, invitationEmail } from '../mail/templates';
import { hashToken, reissueInvitation, type AddedPerson, type PendingInvitation, type Principal } from './commands';
import { canSignIn, personByEmail } from './eligibility';
import { isId, newId } from './ids';
import { sendLimited, sentWithinAMinute, withAddressLock, type SendOutcome } from './mail';
import { firstAddresses } from './settings';

export const EMAIL_ERROR = 'Enter an email address, like name@example.com.';

// A return address is used only if it is a path on this site (layer1-organisations-projects-people#AC-4).
// The address is resolved against a placeholder origin; it is kept only if it stays on that
// origin, and only its path, query and fragment are returned. Control characters and backslashes
// are refused outright, because browsers drop or rewrite them (`/\t/evil.example` becomes
// `//evil.example`).
export function safeReturn(next: string | null | undefined): string {
  if (!next || !next.startsWith('/')) return '/';
  if (/[\u0000-\u001f\u007f\\]/.test(next)) return '/';
  const base = 'http://return.invalid';
  let url: URL;
  try {
    url = new URL(next, base);
  } catch {
    return '/';
  }
  if (url.origin !== base) return '/';
  return `${url.pathname}${url.search}${url.hash}`;
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
  // The check, the replacement of older links and the send happen under the address's lock, so
  // two requests at once give one email and the emailed link is the one that works (AC-2, AC-3).
  await withAddressLock(email, async (tx) => {
    if (await sentWithinAMinute(email, tx)) return;
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
  });
}

// A sign-in request is kept only for the "no longer works" page, which offers another link for a
// day at most; older ones are removed whenever a new one is written.
const SIGN_IN_REQUEST_DAYS = 1;

async function recordSignInRequest(values: { id: string; email: string; returnTo: string | null }) {
  await db()
    .delete(signInRequest)
    .where(lt(signInRequest.createdAt, sql`now() - make_interval(days => ${SIGN_IN_REQUEST_DAYS})`));
  await db().insert(signInRequest).values(values);
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
  await recordSignInRequest({ id: requestId, email, returnTo });
  await sendSignInLink(email, requestId, returnTo, headers);
  return { ok: true, requestId };
}

export async function signInRequestById(id: string) {
  if (!isId(id)) return undefined;
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

type FoundInvitation = { invitation: typeof invitation.$inferSelect; email: string };

// Opening an invitation (AC-5): a valid link is used up, then signs the person in through a
// sign-in link the app takes for itself, and opens What needs you, where a newcomer's first task
// is (layer1-versions-board-first-view#AC-32).
export async function openInvitation(token: string, headers: Headers): Promise<string> {
  const rows = await db()
    .select({ invitation, email: person.email })
    .from(invitation)
    .innerJoin(person, eq(person.id, invitation.personId))
    .where(eq(invitation.tokenHash, hashToken(token)))
    .limit(1);
  return acceptInvitation(rows[0], headers);
}

// Uses up the invitation and returns where its person goes next: the sign-in link that starts
// their session, or the "no longer works" page. Shared with signing in as a person in a trial
// copy, which accepts an invitation as its link would (trying-the-product#AC-12).
export async function acceptInvitation(found: FoundInvitation | undefined, headers: Headers): Promise<string> {
  const noLongerWorks = async () => {
    if (!found) return '/sign-in/no-longer-works';
    const requestId = newId();
    await recordSignInRequest({ id: requestId, email: found.email, returnTo: `/projects/${found.invitation.projectId}` });
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
  return (await takeSignInLink(found.email, '/what-needs-you', headers)) ?? (await noLongerWorks());
}

// A sign-in link the app takes for itself instead of mailing it, to start a session it has
// already decided on: after an invitation, or in a trial copy.
export async function takeSignInLink(email: string, callbackURL: string, headers: Headers): Promise<string | undefined> {
  const capture: { url?: string } = {};
  await linkCapture.run(capture, () =>
    auth().api.signInMagicLink({
      body: { email, callbackURL, errorCallbackURL: '/sign-in/no-longer-works' },
      headers,
    }),
  );
  return capture.url;
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

// After a command that gave someone their first dashboard role (Change roles, or chosen as owner):
// make their account, then email the invitation (AC-30).
export async function deliverInvitation(
  pending: PendingInvitation,
  context: { projectId: string; adder: string; origin: string },
): Promise<SendOutcome> {
  const projectRow = (await db().select({ name: project.name }).from(project).where(eq(project.id, context.projectId)).limit(1))[0];
  if (pending.needsAccount) await ensureAccount(pending.email, pending.display === pending.email ? null : pending.display);
  return sendInvitation(pending.email, pending.token, {
    projectName: projectRow?.name ?? '',
    adder: context.adder,
    origin: context.origin,
    roles: pending.roles,
  });
}

// **Send the sign-in link again** (AC-31). The address and project name come from the record,
// never from the form. Under the address's lock, a refused resend replaces nothing, so the earlier
// link keeps working.
export async function resendInvitation(
  principal: Principal,
  projectId: string,
  personId: string,
  context: { adder: string; origin: string },
): Promise<SendOutcome | 'not-found'> {
  if (!isId(projectId) || !isId(personId)) return 'not-found';
  const target = (await db().select({ email: person.email }).from(person).where(eq(person.id, personId)).limit(1))[0];
  if (!target) return 'not-found';
  return withAddressLock(target.email, async (tx) => {
    if (await sentWithinAMinute(target.email, tx)) return 'limited';
    const result = await reissueInvitation(principal, projectId, personId);
    if (!result.ok) return 'not-found';
    const projectRow = (await db().select({ name: project.name }).from(project).where(eq(project.id, projectId)).limit(1))[0];
    return sendInvitation(result.value.email, result.value.token, {
      projectName: projectRow?.name ?? '',
      adder: context.adder,
      origin: context.origin,
      roles: result.value.roles,
    });
  });
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
