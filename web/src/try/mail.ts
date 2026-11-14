import 'server-only';
import type { OutgoingMail } from '../mail/transport';

export type KeptMail = OutgoingMail & { id: string; sentAt: Date };

export async function keepMail(mail: OutgoingMail): Promise<void> {
  void mail;
}

export async function listMail(): Promise<KeptMail[]> {
  return [{ id: '00000000-0000-0000-0000-000000000000', to: 'nobody@xr.test', subject: 'stub', text: 'stub', sentAt: new Date(0) }];
}

export async function mailById(id: string): Promise<KeptMail | undefined> {
  void id;
  return undefined;
}
