import 'server-only';
import { eq, isNull, and } from 'drizzle-orm';
import { auth } from '../auth/auth';
import { db } from '../db/client';
import { person } from '../db/schema';

// Who is acting. Sessions hold identity only; roles are read from the record on each request
// (decision-identity-and-roles), so a role change applies at the person's next request.
export type Principal = {
  type: 'person' | 'agent-session';
  personId: string;
  channel: 'dashboard' | 'api' | 'agent';
};

export type SignedIn = {
  principal: Principal;
  person: { id: string; email: string; name: string | null; display: string };
};

export const displayName = (p: { name: string | null; email: string }) => p.name?.trim() || p.email;

export async function signedIn(headers: Headers, channel: Principal['channel'] = 'dashboard'): Promise<SignedIn | null> {
  const session = await auth().api.getSession({ headers });
  if (!session) return null;
  const rows = await db().select().from(person).where(eq(person.authUserId, session.user.id)).limit(1);
  const me = rows[0];
  if (!me) return null;
  if (!me.firstSignedInAt) {
    await db()
      .update(person)
      .set({ firstSignedInAt: new Date() })
      .where(and(eq(person.id, me.id), isNull(person.firstSignedInAt)));
  }
  return {
    principal: { type: 'person', personId: me.id, channel },
    person: { id: me.id, email: me.email, name: me.name, display: displayName(me) },
  };
}
