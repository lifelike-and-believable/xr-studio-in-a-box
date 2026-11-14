import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { mailById } from '@/try/mail';
import { tryMode } from '@/try/mode';
import { atTime, viewerZone } from '@/ui/time';

type Props = { params: Promise<{ message: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!tryMode()) return {};
  const mail = await mailById((await params).message);
  return { title: mail ? mail.subject : 'This page is not available' };
}

// Each address in the text becomes a link that can be followed (trying-the-product#AC-18).
function withLinks(text: string): ReactNode[] {
  return text.split(/(https?:\/\/\S+)/).map((part, i) => (i % 2 === 1 ? <a key={i} href={part}>{part}</a> : part));
}

export default async function TryMessagePage({ params }: Props) {
  if (!tryMode()) notFound();
  const mail = await mailById((await params).message);
  if (!mail) notFound();
  const zone = await viewerZone();
  return (
    <main id="main">
      <h1>{mail.subject}</h1>
      <dl className="meta">
        <dt>To</dt>
        <dd>{mail.to}</dd>
        <dt>Subject</dt>
        <dd>{mail.subject}</dd>
        <dt>Sent</dt>
        <dd>{atTime(mail.sentAt, zone)}</dd>
      </dl>
      <div className="try-message">{withLinks(mail.text)}</div>
      <p>
        <a href="/try/mail">Back to email sent by this copy</a>
      </p>
    </main>
  );
}
