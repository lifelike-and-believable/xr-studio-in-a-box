import { EmailSchema, SignInLinkRequest } from '@xr/contracts';
import { after } from 'next/server';
import { clientIp, overIpLimit } from '@/record/ip-limit';
import { EMAIL_ERROR, requestSignInLink } from '@/record/sign-in';
import { body, invalid } from '@/ui/api';

const NEUTRAL = 'If this address can sign in, we have sent it a sign-in link.';

// The neutral sign-in request (layer1-organisations-projects-people#AC-1, AC-3). The answer is
// sent before eligibility is checked or any email goes out, so neither the reply nor its timing
// says whether the address can sign in.
export async function POST(request: Request) {
  if (overIpLimit(clientIp(request.headers))) {
    return Response.json({ message: 'Too many requests. Try again in a minute.' }, { status: 429 });
  }
  const parsed = SignInLinkRequest.safeParse(await body(request));
  if (!parsed.success) return invalid(parsed.error.issues);
  if (!EmailSchema.safeParse(parsed.data.email).success) {
    return Response.json({ fields: { email: EMAIL_ERROR } }, { status: 400 });
  }
  const headers = new Headers(request.headers);
  after(async () => {
    try {
      await requestSignInLink(parsed.data.email, parsed.data.next, headers);
    } catch {
      // The reason can name the database or mail settings; a fixed message is enough here.
      console.error('sign-in: a link request could not be completed');
    }
  });
  return Response.json({ status: NEUTRAL });
}
