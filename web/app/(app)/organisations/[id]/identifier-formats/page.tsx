import type { Metadata } from 'next';
import Link from 'next/link';
import { formatRows } from '@/record/facts';
import { removeFormatAction, setFormatAction } from '../../../facts-actions';
import { ConfirmDialog } from '@/ui/dialog';
import { Notice } from '@/ui/notice';
import { openOrganisation } from '@/ui/organisation-access';
import { dayOf, viewerZone } from '@/ui/time';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string; name?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lead = notice(await searchParams, '')?.split('. ')[0]?.replace(/\.$/, '');
  return { title: lead ? `${lead} - Identifier formats` : 'Identifier formats' };
}

function notice(search: { notice?: string; name?: string }, organisation: string): string | undefined {
  const name = search.name ?? '';
  switch (search.notice) {
    case 'added':
      return `${name} added. It is checked from now on; text already saved is not changed.`;
    case 'on':
      return `${name} turned on. It is checked from now on; text already saved is not changed.`;
    case 'off':
      return `${name} turned off. Text that only matches it is now saved where agents can read it. Turn it on again at any time.`;
    case 'removed':
      return `${name} removed. It is no longer checked in any of ${organisation}'s projects. Its removal is recorded in Activity.`;
    default:
      return undefined;
  }
}

// An organisation's identifier formats, for the people who look after it (layer1-facts-identifiers-activity#AC-27 to AC-30).
export default async function IdentifierFormats({ params, searchParams }: Props) {
  const { id } = await params;
  const { access } = await openOrganisation(id, `/organisations/${id}/identifier-formats`, 'steward');
  const zone = await viewerZone();
  const formats = await formatRows(id);
  const message = notice(await searchParams, access.ownerName);
  const fields = { organisationId: id };
  return (
    <main id="main">
      {message ? <Notice title={message.split('. ')[0]?.replace(/\.$/, '')}>{message}</Notice> : null}
      <p className="hint">
        <Link href={`/organisations/${id}`}>{access.ownerName}</Link>
      </p>
      <h1>Identifier formats</h1>
      <p className="lead">
        Text matching a format that is On is not saved where agents can read it, in any of {access.ownerName}&apos;s projects: facts and documents now, chat
        from a later release. A person can still save it by confirming it is not an identifier; each confirmation is recorded in Activity. Matching ignores
        spaces, hyphens and dots between characters, so 046 454 286 and 046-454-286 both match. People who look after {access.ownerName} can change this list,
        and every change is recorded in its activity.
      </p>
      <div className="actions">
        <Link className="button" href={`/organisations/${id}/identifier-formats/new`}>
          Add a format
        </Link>
      </div>
      <table>
        <caption className="visually-hidden">Identifier formats for {access.ownerName}</caption>
        <thead>
          <tr>
            <th scope="col">Format</th>
            <th scope="col">What it matches</th>
            <th scope="col">Checking</th>
            <th scope="col">Source</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {formats.map((f) => (
            <tr key={f.id}>
              <td data-label="Format">{f.name}</td>
              <td data-label="What it matches">{f.matches}</td>
              <td data-label="Checking">{f.on ? 'On' : 'Off'}</td>
              <td data-label="Source">{f.source ? `${f.source.by}, ${dayOf(f.source.at, zone)}` : 'Starter'}</td>
              <td>
                <span className="row-actions">
                  {f.on ? (
                    <ConfirmDialog
                      trigger={
                        <>
                          Turn off<span className="visually-hidden"> {f.name}</span>
                        </>
                      }
                      heading={`Turn off ${f.name}?`}
                      description={`Text that only looks like ${f.noun.match(/^[aeiou]/i) ? 'an' : 'a'} ${f.noun} will then be saved where agents can read it, in all of ${access.ownerName}'s projects. Turn a format off only if it keeps stopping ordinary text.`}
                      safe="Keep it on"
                      confirm="Turn off"
                      action={setFormatAction}
                      fields={{ ...fields, formatId: f.id, on: 'false' }}
                    />
                  ) : (
                    <form action={setFormatAction} className="inline">
                      <input type="hidden" name="organisationId" value={id} />
                      <input type="hidden" name="formatId" value={f.id} />
                      <input type="hidden" name="on" value="true" />
                      <button type="submit" className="link">
                        Turn on<span className="visually-hidden"> {f.name}</span>
                      </button>
                    </form>
                  )}
                  {f.starter ? null : (
                    <ConfirmDialog
                      trigger={
                        <>
                          Remove<span className="visually-hidden"> {f.name}</span>
                        </>
                      }
                      heading={`Remove ${f.name}?`}
                      description={`It is no longer checked in any of ${access.ownerName}'s projects. To check it again, add it again. If you might need it later, turn it off instead.`}
                      safe={`Keep ${f.name}`}
                      confirm={`Remove ${f.name}`}
                      action={removeFormatAction}
                      fields={{ ...fields, formatId: f.id }}
                      danger
                    />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint">Starter formats can be turned off but not removed.</p>
    </main>
  );
}
