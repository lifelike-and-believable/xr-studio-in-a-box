import 'server-only';
import type { Refusal } from '@/record/commands';
import { signedIn } from '@/record/principal';

// Shared by the /api/v1 handlers: who is calling, and how refusals look.
export async function caller(request: Request) {
  return signedIn(request.headers, 'api');
}

export const unauthorised = () => Response.json({ message: 'Sign in first.' }, { status: 401 });

export function refusal(r: Refusal) {
  return Response.json({ status: r.status, message: r.message, fields: r.fields }, { status: r.status });
}

export async function body(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function invalid(issues: unknown) {
  return Response.json({ status: 400, message: 'The request body is not valid.', issues }, { status: 400 });
}
