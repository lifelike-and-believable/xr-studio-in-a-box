import { SetRolesRequest } from '@xr/contracts';
import { setRoles } from '@/record/commands';
import { body, caller, invalid, refusal, unauthorised } from '@/ui/api';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; personId: string }> }) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const parsed = SetRolesRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const { id, personId } = await params;
  const result = await setRoles(me.principal, id, personId, parsed.data);
  return result.ok ? Response.json(result.value) : refusal(result);
}
