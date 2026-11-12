import { originOf } from '@/record/settings';
import { resendInvitation } from '@/record/sign-in';
import { caller, unauthorised } from '@/ui/api';

// Send the invitation again (layer1-organisations-projects-people#AC-31). The address and project
// come from the record, and a refused resend leaves the earlier link working.
export async function POST(request: Request, { params }: { params: Promise<{ id: string; personId: string }> }) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const { id, personId } = await params;
  const outcome = await resendInvitation(me.principal, id, personId, { adder: me.person.display, origin: originOf(request.headers) });
  if (outcome === 'not-found') return Response.json({ message: 'This page is not available' }, { status: 404 });
  if (outcome === 'limited') return Response.json({ message: 'You can send another in a minute' }, { status: 429 });
  return Response.json({ outcome });
}
