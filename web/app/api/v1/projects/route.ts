import { StartProjectRequest } from '@xr/contracts';
import { startProject } from '@/record/commands';
import { projectsFor } from '@/record/queries';
import { originOf } from '@/record/settings';
import { deliverInvitation } from '@/record/sign-in';
import { body, caller, invalid, refusal, unauthorised } from '@/ui/api';

export async function GET(request: Request) {
  const me = await caller(request);
  if (!me) return unauthorised();
  return Response.json(await projectsFor(me.person.id));
}

export async function POST(request: Request) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const parsed = StartProjectRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const result = await startProject(me.principal, parsed.data);
  if (!result.ok) return refusal(result);
  const { ownerInvitation, ...created } = result.value;
  const mail = ownerInvitation
    ? await deliverInvitation(ownerInvitation, { projectId: created.id, adder: me.person.display, origin: originOf(request.headers) })
    : undefined;
  return Response.json({ ...created, ...(mail ? { ownerMail: mail } : {}) }, { status: 201 });
}
