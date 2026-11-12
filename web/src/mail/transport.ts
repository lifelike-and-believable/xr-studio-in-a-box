import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { MailContent } from './templates';

export type OutgoingMail = MailContent & { to: string };

// One transport for slice 1: each message is written as a JSON file to MAIL_CAPTURE_DIR, and
// nothing leaves the machine (layer1-organisations-projects-people#AC-12). The production
// transport (Amazon SES in ca-central-1) is added before the first deployment.
export function deliver(mail: OutgoingMail): void {
  const dir = process.env.MAIL_CAPTURE_DIR;
  if (!dir) throw new Error('mail: no transport is configured (set MAIL_CAPTURE_DIR)');
  // The .invalid top-level domain can never receive mail (RFC 2606), so the capture transport
  // refuses it the way a real transport would refuse an undeliverable address.
  if (/\.invalid$/i.test(mail.to)) throw new Error('mail: the address cannot receive mail');
  mkdirSync(dir, { recursive: true });
  const sentAt = new Date().toISOString();
  const file = `${sentAt.replace(/[:.]/g, '-')}-${randomUUID()}.json`;
  writeFileSync(path.join(dir, file), JSON.stringify({ ...mail, sentAt }));
}
