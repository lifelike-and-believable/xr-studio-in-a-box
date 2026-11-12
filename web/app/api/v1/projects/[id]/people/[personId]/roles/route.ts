import { SetRolesRequest } from '@xr/contracts';
import { setRoles } from '@/record/commands';
import { originOf } from '@/record/settings';
import { deliverInvitation } from '@/record/sign-in';
import { body, caller, invalid, refusal, unauthorised } from '@/ui/api';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; personId: string }> }) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const parsed = SetRolesRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const { id, personId } = await params;
  const result = await setRoles(me.principal, id, personId, parsed.data);
  if (!result.ok) return refusal(result);
  const { invitation, ...saved } = result.value;
  // A first dashboard role brings an account and an invitation (AC-30).
  const mail = invitation
    ? await deliverInvitation(invitation, { projectId: id, adder: me.person.display, origin: originOf(request.headers) })
    : undefined;
  return Response.json({ ...saved, ...(mail ? { mail } : {}) });
}
