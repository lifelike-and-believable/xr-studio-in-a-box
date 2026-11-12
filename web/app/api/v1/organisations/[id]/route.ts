import { EditOrganisationRequest } from '@xr/contracts';
import { editOrganisation } from '@/record/commands';
import { organisationFor } from '@/record/queries';
import { body, caller, invalid, refusal, unauthorised } from '@/ui/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const org = await organisationFor(me.person.id, (await params).id);
  return org ? Response.json(org) : Response.json({ message: 'This page is not available' }, { status: 404 });
}

export async function PATCH(request: Request, { params }: Params) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const parsed = EditOrganisationRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const result = await editOrganisation(me.principal, (await params).id, parsed.data);
  return result.ok ? Response.json(result.value) : refusal(result);
}
