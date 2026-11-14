import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { listMail } from '@/try/mail';
import { tryMode } from '@/try/mode';
import { atTime, viewerZone } from '@/ui/time';

export const metadata: Metadata = { title: 'Email sent by this copy' };

// Email sent by this copy (trying-the-product#AC-17): newest first.
export default async function TryMailPage() {
  // Decided at each request, never at build time.
  await connection();
  if (!tryMode()) notFound();
  const mail = await listMail();
  const zone = await viewerZone();
  return (
    <main id="main">
      <p>
        <a href="/try">Try XR Studio</a>
      </p>
      <h1>Email sent by this copy</h1>
      {mail.length === 0 ? (
        <p>No email has been sent by this copy yet.</p>
      ) : (
        <table>
          <caption className="visually-hidden">Email sent by this copy, newest first</caption>
          <thead>
            <tr>
              <th scope="col">To</th>
              <th scope="col">Subject</th>
              <th scope="col">Sent</th>
              <th scope="col">
                <span className="visually-hidden">Open a message</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {mail.map((m) => (
              <tr key={m.id}>
                <td data-label="To">{m.to}</td>
                <td data-label="Subject">{m.subject}</td>
                <td data-label="Sent">{atTime(m.sentAt, zone)}</td>
                <td>
                  <a href={`/try/mail/${m.id}`} aria-label={`Open: ${m.subject}, to ${m.to}`}>
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
