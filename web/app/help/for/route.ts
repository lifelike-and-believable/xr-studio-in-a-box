import { helpContent } from '@/help/content';
import { helpPathFor } from '@/help/match';

// Help in the header (help-tutorials-and-previews#AC-1): the help for the address it came from.
export function GET(request: Request) {
  const from = new URL(request.url).searchParams.get('path') ?? '/';
  const to = helpPathFor(helpContent(), from.startsWith('/') ? from : '/');
  return new Response(null, { status: 303, headers: { location: to } });
}
