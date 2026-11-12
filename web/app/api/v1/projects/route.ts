import { StartProjectRequest } from '@xr/contracts';
import { startProject } from '@/record/commands';
import { projectsFor } from '@/record/queries';
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
  return result.ok ? Response.json(result.value, { status: 201 }) : refusal(result);
}
