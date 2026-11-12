import 'server-only';
import { RoleIdSchema, usesDashboard } from '@xr/contracts';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { person, projectRole } from '../db/schema';
import { firstAddresses } from './settings';

export async function personByEmail(email: string) {
  const rows = await db()
    .select()
    .from(person)
    .where(sql`lower(${person.email}) = ${email.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

// Who may be sent a sign-in link (layer1-organisations-projects-people#AC-1, AC-11): an address
// in SIGN_IN_FIRST_ADDRESSES, or a person with a dashboard account who has a role that uses the
// dashboard. Nobody else, so there is no other way to sign up.
export async function canSignIn(email: string): Promise<boolean> {
  if (firstAddresses().has(email.toLowerCase())) return true;
  const found = await personByEmail(email);
  if (!found?.authUserId) return false;
  const roles = await db().select({ role: projectRole.role }).from(projectRole).where(eq(projectRole.personId, found.id));
  return usesDashboard(roles.map((r) => RoleIdSchema.parse(r.role)));
}
