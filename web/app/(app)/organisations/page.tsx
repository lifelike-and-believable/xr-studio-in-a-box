import type { Metadata } from 'next';
import Link from 'next/link';
import { organisationsFor } from '@/record/queries';
import { requirePerson } from '@/ui/session';

export const metadata: Metadata = { title: 'Organisations' };

// **Organisations** (layer1-organisations-projects-people#AC-25).
export default async function Organisations() {
  const me = await requirePerson('/organisations');
  const organisations = await organisationsFor(me.person.id);
  return (
    <main id="main">
      <h1>Organisations</h1>
      <p>
        <Link href="/organisations/new" className="button">
          Create an organisation
        </Link>
      </p>
      {organisations.length === 0 ? (
        <p>You do not look after any organisations, and you are not on any projects yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Organisation</th>
              <th scope="col">You</th>
            </tr>
          </thead>
          <tbody>
            {organisations.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link href={`/organisations/${o.id}`}>{o.name}</Link>
                </td>
                <td data-label="You">{o.you}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
