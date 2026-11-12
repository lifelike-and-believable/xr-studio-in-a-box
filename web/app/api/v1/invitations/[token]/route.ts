import { openInvitation } from '@/record/sign-in';

// The link in an invitation email (layer1-organisations-projects-people#AC-5).
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const target = await openInvitation((await params).token, request.headers);
  return Response.redirect(new URL(target, request.url), 303);
}
