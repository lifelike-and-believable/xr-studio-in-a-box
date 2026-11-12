import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/auth/auth';

// The auth library's own routes: magic link verification, passkeys, sign-out.
export async function GET(request: Request) {
  return toNextJsHandler(auth()).GET(request);
}

export async function POST(request: Request) {
  return toNextJsHandler(auth()).POST(request);
}
