import { SignInLinkRequest } from '@xr/contracts';
import { requestSignInLink } from '@/record/sign-in';
import { body, invalid } from '@/ui/api';

// The neutral sign-in request (layer1-organisations-projects-people#AC-1, AC-3).
export async function POST(request: Request) {
  const parsed = SignInLinkRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  const result = await requestSignInLink(parsed.data.email, parsed.data.next, request.headers);
  return result.ok ? Response.json({ status: 'If this address can sign in, we have sent it a sign-in link.' }) : Response.json({ fields: { email: result.error } }, { status: 400 });
}
