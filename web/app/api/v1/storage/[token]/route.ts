import { receiveUpload } from '@/storage/storage';

// Receives a work sample's bytes for a signed upload token. It writes only to object storage,
// never to the database; registering the upload is a command (layer1-facts-identifiers-activity#AC-40).
export async function PUT(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const result = await receiveUpload((await params).token, request.body);
  return result.ok ? new Response(null, { status: 204 }) : Response.json({ message: result.message }, { status: result.status });
}
