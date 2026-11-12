import { EditProjectRequest } from '@xr/contracts';
import { editProject } from '@/record/commands';
import { projectFor } from '@/record/queries';
import { body, caller, invalid, refusal, unauthorised } from '@/ui/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const { id } = await params;
  const view = await projectFor(me.person.id, id);
  if (view.state !== 'open') return Response.json({ message: 'This page is not available' }, { status: 404 });
  return Response.json({ ...view.project, organisation: view.organisation, roles: view.roles, permissions: [...view.can] });
}

export async function PATCH(request: Request, { params }: Params) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const parsed = EditProjectRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const result = await editProject(me.principal, (await params).id, parsed.data);
  return result.ok ? Response.json(result.value) : refusal(result);
}
