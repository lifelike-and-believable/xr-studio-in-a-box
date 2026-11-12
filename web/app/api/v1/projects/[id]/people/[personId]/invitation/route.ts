import { reissueInvitation } from '@/record/commands';
import { sentWithinAMinute } from '@/record/mail';
import { personOn, projectFor } from '@/record/queries';
import { originOf } from '@/record/settings';
import { sendInvitation } from '@/record/sign-in';
import { caller, refusal, unauthorised } from '@/ui/api';

// Send the invitation again (layer1-organisations-projects-people#AC-31).
export async function POST(request: Request, { params }: { params: Promise<{ id: string; personId: string }> }) {
  const me = await caller(request);
  if (!me) return unauthorised();
  const { id, personId } = await params;
  const view = await projectFor(me.person.id, id);
  if (view.state !== 'open') return Response.json({ message: 'This page is not available' }, { status: 404 });
  // Checked first, so a refused resend leaves the earlier link working.
  const { target } = await personOn(id, personId);
  if (target && (await sentWithinAMinute(target.email))) {
    return Response.json({ message: 'You can send another in a minute' }, { status: 429 });
  }
  const result = await reissueInvitation(me.principal, id, personId);
  if (!result.ok) return refusal(result);
  const outcome = await sendInvitation(result.value.email, result.value.token, {
    projectName: view.project.name,
    adder: me.person.display,
    origin: originOf(request.headers),
    roles: result.value.roles,
  });
  return Response.json({ outcome });
}
