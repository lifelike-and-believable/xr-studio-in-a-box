import { connection } from 'next/server';
import { checkHealth } from '@/health/check';
import { probeDatabase } from '@/health/probe';

export async function GET() {
  await connection();
  const { httpStatus, body } = await checkHealth(probeDatabase);
  return Response.json(body, { status: httpStatus });
}
