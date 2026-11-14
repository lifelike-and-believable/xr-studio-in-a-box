import 'server-only';
import { createHash, randomBytes, timingSafeEqual, webcrypto } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, open, readFile, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db/client';
import { tryFile } from '../db/schema';
import { tryMode } from '../try/mode';

// Object storage for work samples (layer1-facts-identifiers-activity, Scope). In tests and local
// work it is a folder (STORAGE_DIR); the S3 transport is added before the first deployment. Bytes
// reach it only through a signed upload token. A preview keeps them in its database instead.

const TOKEN_SECONDS = 60 * 60;

// A preview on Vercel keeps files in its own database, 4 MB at most; a local trial copy and every
// other place keep them in the folder, with no such limit (help-tutorials-and-previews#AC-18).
export const TRY_FILE_LIMIT = 4 * 1024 * 1024;
export const TRY_FILE_TOO_BIG = 'In a trial copy on the web, a file can be 4 MB at most. This limit is not in XR Studio itself.';
const inDatabase = () => tryMode() && process.env.VERCEL === '1';

async function storedBytes(key: string): Promise<Buffer | null> {
  const rows = await db().select({ bytes: tryFile.bytes }).from(tryFile).where(eq(tryFile.key, KeySchema.parse(key))).limit(1);
  return rows[0]?.bytes ?? null;
}

async function receiveIntoDatabase(key: string, max: number, body: Uint8Array | ReadableStream<Uint8Array> | null): Promise<Received> {
  if (await storedBytes(key)) return { ok: false, status: 409, message: 'This upload address has been used.' };
  const parts: Uint8Array[] = [];
  let size = 0;
  for await (const chunk of body instanceof Uint8Array ? [body] : body ? streamChunks(body) : []) {
    size += chunk.length;
    if (size > TRY_FILE_LIMIT) return { ok: false, status: 413, message: TRY_FILE_TOO_BIG };
    if (size > max) return { ok: false, status: 413, message: 'The file is larger than the size declared for it.' };
    parts.push(chunk);
  }
  // The write is the command layer's (layer1-organisations-projects-people#AC-37); loaded here, not
  // above, because the command layer also loads this module.
  const { keepTrialFile } = await import('../record/commands');
  return (await keepTrialFile(key, Buffer.concat(parts))) ? { ok: true } : { ok: false, status: 409, message: 'This upload address has been used.' };
}

function dir(): string {
  const value = process.env.STORAGE_DIR;
  if (!value) throw new Error('STORAGE_DIR is not set');
  return value;
}

function secret(): string {
  const value = process.env.STORAGE_SIGNING_SECRET;
  if (!value) throw new Error('STORAGE_SIGNING_SECRET is not set');
  return value;
}

// Keys are made by the command layer from ids, so a key never comes from a person.
const KeySchema = z.string().regex(/^[0-9a-f-]{36}$/);
const fileFor = (key: string) => path.join(dir(), KeySchema.parse(key));

async function sign(payload: string): Promise<string> {
  const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Buffer.from(await webcrypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))).toString('base64url');
}

// A token names one storage key and one maximum size, and expires after an hour. It is single
// use: the bytes can be sent once (receiveUpload refuses a key that has bytes already).
export async function signUpload(key: string, maxBytes: number, now = Date.now()): Promise<string> {
  const payload = Buffer.from(JSON.stringify({ k: KeySchema.parse(key), m: maxBytes, e: now + TOKEN_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${await sign(payload)}`;
}

const TokenBody = z.object({ k: z.string(), m: z.number().int().nonnegative(), e: z.number() });

async function readToken(token: string): Promise<{ key: string; max: number } | null> {
  const [payload, mac] = token.split('.');
  if (!payload || !mac) return null;
  const expected = Buffer.from(await sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const body = TokenBody.parse(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')));
    if (body.e < Date.now() || !KeySchema.safeParse(body.k).success) return null;
    return { key: body.k, max: body.m };
  } catch {
    return null;
  }
}

export type Received = { ok: true } | { ok: false; status: 403 | 409 | 413; message: string };

// Receives the bytes for a signed token, up to its declared size.
export async function receiveUpload(token: string, body: Uint8Array | ReadableStream<Uint8Array> | null): Promise<Received> {
  const claim = await readToken(token);
  if (!claim) return { ok: false, status: 403, message: 'The upload address is not valid or has expired.' };
  if (inDatabase()) return receiveIntoDatabase(claim.key, claim.max, body);
  await mkdir(dir(), { recursive: true });
  const final = fileFor(claim.key);
  const part = `${final}.part`;
  if (await exists(final)) return { ok: false, status: 409, message: 'This upload address has been used.' };
  let handle;
  try {
    handle = await open(part, 'wx');
  } catch {
    return { ok: false, status: 409, message: 'This upload address has been used.' };
  }
  let written = 0;
  try {
    const chunks: AsyncIterable<Uint8Array> | Uint8Array[] = body instanceof Uint8Array ? [body] : body ? streamChunks(body) : [];
    for await (const chunk of chunks) {
      written += chunk.length;
      if (written > claim.max) {
        await handle.close();
        await rm(part, { force: true });
        return { ok: false, status: 413, message: 'The file is larger than the size declared for it.' };
      }
      await handle.write(chunk);
    }
    await handle.close();
    await rename(part, final);
    return { ok: true };
  } catch (error) {
    await handle.close().catch(() => undefined);
    await rm(part, { force: true });
    throw error;
  }
}

async function* streamChunks(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    yield value;
  }
}

async function exists(file: string): Promise<boolean> {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

// The stored size, or null when no bytes arrived.
export async function storedSize(key: string): Promise<number | null> {
  if (inDatabase()) {
    const rows = await db().select({ size: sql<number>`octet_length(${tryFile.bytes})` }).from(tryFile).where(eq(tryFile.key, KeySchema.parse(key))).limit(1);
    return rows[0] ? Number(rows[0].size) : null;
  }
  try {
    return (await stat(fileFor(key))).size;
  } catch {
    return null;
  }
}

export async function readStart(key: string, bytes: number): Promise<Uint8Array> {
  if (inDatabase()) return new Uint8Array((await storedBytes(key))?.subarray(0, bytes) ?? []);
  const handle = await open(fileFor(key), 'r');
  try {
    const buffer = Buffer.alloc(bytes);
    const { bytesRead } = await handle.read(buffer, 0, bytes, 0);
    return new Uint8Array(buffer.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
}

export async function readAll(key: string): Promise<Uint8Array> {
  if (inDatabase()) {
    const found = await storedBytes(key);
    if (!found) throw new Error('storage: no such file');
    return new Uint8Array(found);
  }
  return new Uint8Array(await readFile(fileFor(key)));
}

export async function sha256Of(key: string): Promise<string> {
  if (inDatabase()) {
    const hash = createHash('sha256');
    hash.end(await readAll(key));
    return (hash.read() as Buffer).toString('hex');
  }
  const hash = createHash('sha256');
  await pipeline(createReadStream(fileFor(key)), hash);
  return (hash.read() as Buffer).toString('hex');
}

export async function removeStored(key: string): Promise<void> {
  if (inDatabase()) {
    const { removeTrialFile } = await import('../record/commands');
    return removeTrialFile(KeySchema.parse(key));
  }
  await rm(fileFor(key), { force: true });
  await rm(`${fileFor(key)}.part`, { force: true });
}

export const newStorageKey = () => {
  const b = randomBytes(16).toString('hex');
  return `${b.slice(0, 8)}-${b.slice(8, 12)}-${b.slice(12, 16)}-${b.slice(16, 20)}-${b.slice(20)}`;
};
