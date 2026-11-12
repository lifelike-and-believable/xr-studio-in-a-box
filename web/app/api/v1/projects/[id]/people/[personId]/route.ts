import { removePerson } from '@/record/commands';
import { caller, refusal, unauthorised } from '@/ui/api';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; personId: string }> }) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const { id, personId } = await params;
  const result = await removePerson(me.principal, id, personId);
  return result.ok ? new Response(null, { status: 204 }) : refusal(result);
}
