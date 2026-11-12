import { AddPersonRequest } from '@xr/contracts';
import { addPerson } from '@/record/commands';
import { peopleOn, projectFor } from '@/record/queries';
import { originOf } from '@/record/settings';
import { sendAddedMail } from '@/record/sign-in';
import { body, caller, invalid, refusal, unauthorised } from '@/ui/api';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const { id } = await params;
  const view = await projectFor(me.person.id, id);
  if (view.state !== 'open' || !view.can.has('see-people')) return Response.json({ message: 'This page is not available' }, { status: 404 });
  return Response.json(await peopleOn(id));
}

export async function POST(request: Request, { params }: Params) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const parsed = AddPersonRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const { id } = await params;
  const result = await addPerson(me.principal, id, parsed.data);
  if (!result.ok) return refusal(result);
  const mail = await sendAddedMail(result.value, { projectId: id, adder: me.person.display, origin: originOf(request.headers) });
  return Response.json({ personId: result.value.personId, outcome: result.value.outcome, mail }, { status: 201 });
}
