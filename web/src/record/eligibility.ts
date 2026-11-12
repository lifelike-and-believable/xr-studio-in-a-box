import 'server-only';
import { usesDashboard, type RoleId } from '@xr/contracts';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { organisationSteward, person, projectRole } from '../db/schema';
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
// dashboard or looks after an organisation. Nobody else, so there is no other way to sign up.
export async function canSignIn(email: string): Promise<boolean> {
  if (firstAddresses().has(email.toLowerCase())) return true;
  const found = await personByEmail(email);
  if (!found?.authUserId) return false;
  const roles = await db().select({ role: projectRole.role }).from(projectRole).where(eq(projectRole.personId, found.id));
  if (usesDashboard(roles.map((r) => r.role as RoleId))) return true;
  const stewards = await db()
    .select({ id: organisationSteward.organisationId })
    .from(organisationSteward)
    .where(eq(organisationSteward.personId, found.id))
    .limit(1);
  return stewards.length > 0;
}
