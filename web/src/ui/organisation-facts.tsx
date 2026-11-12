import 'server-only';
import { FUNDERS, FUNDER_FACTS, ORGANISATION_FACTS, type Fact } from '@xr/contracts';
import Link from 'next/link';
import type { Owner } from '@/record/commands';
import { accessFor, currentFacts, samplesIn } from '@/record/facts';
import { FactBlock } from './fact-pages';
import { editPath, historyPath, samplesPath } from './paths';
import { atTime } from './time';

// The Organisation facts section of an organisation's page (layer1-facts-identifiers-activity#AC-13,
// AC-16, AC-17, AC-18).
export async function OrganisationFacts({ organisationId, personId, zone }: { organisationId: string; personId: string; zone: string }) {
  const owner: Owner = { kind: 'organisation', id: organisationId };
  const access = await accessFor(personId, owner);
  if (!access) return null;
  const general = await currentFacts(owner, ORGANISATION_FACTS, access.canSee);
  const profiles = await currentFacts(owner, FUNDER_FACTS, access.canSee);
  const samples = (await currentFacts(owner, ['standard-work-samples'] as Fact[], access.canSee))[0]?.current;
  const sampleList = await samplesIn(samples?.value);
  const seeProfiles = access.canSee(FUNDER_FACTS[0] as Fact);
  return (
    <>
      <h2>Organisation facts</h2>
      <p className="lead">Recorded once and read by every project in the organisation. People who look after the organisation edit them.</p>
      <p className="hint">
        Bank details and tax numbers are not organisation facts. They will be kept in the protected store, which comes in a later release; until then
        keep them out of XR Studio.
      </p>
      <div className="fact-list">
        {general.map((entry) => (
          <FactBlock key={entry.fact} owner={owner} entry={entry} canEdit={access.canEdit} zone={zone} />
        ))}
        <div className="fact">
          <h3>Funder applicant profiles</h3>
          {seeProfiles ? (
            <>
              <p className="hint">One for each funder on the program list. Visible to the people who look after the organisation, and to the director and producer on its projects.</p>
              <ul>
                {FUNDERS.map((funder, i) => {
                  const current = profiles[i]?.current;
                  const fact = FUNDER_FACTS[i] as Fact;
                  const hidden = <span className="visually-hidden"> the profile for {funder.name}</span>;
                  return (
                    <li key={funder.slug}>
                      {funder.name}: {current ? `recorded, last changed by ${current.by}, ${atTime(current.at, zone)}.` : 'not recorded yet.'}{' '}
                      {access.canEdit ? (
                        <Link href={editPath(owner, fact)}>
                          {current ? 'Edit' : 'Add'}
                          {hidden}
                        </Link>
                      ) : null}{' '}
                      {current ? (
                        <Link href={historyPath(owner, fact)}>
                          Earlier versions<span className="visually-hidden"> of the profile for {funder.name}</span>
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="hint">Visible to the people who look after the organisation, and to the director and producer on its projects.</p>
          )}
        </div>
        <div className="fact">
          <h3>Standard work samples</h3>
          {samples && sampleList.length > 0 ? (
            <>
              <ul>
                {sampleList.map((s) => (
                  <li key={s.fileId}>{s.title}</li>
                ))}
              </ul>
              <p className="hint">
                Last changed by {samples.by}, {atTime(samples.at, zone)}
              </p>
            </>
          ) : (
            <p>Not recorded yet.</p>
          )}
          <p className="fact-actions">
            {access.canEdit ? (
              <Link href={samplesPath(owner)}>{sampleList.length > 0 ? 'Open standard work samples' : 'Add standard work samples'}</Link>
            ) : null}{' '}
            {samples ? (
              <Link href={historyPath(owner, 'standard-work-samples')}>
                Earlier versions<span className="visually-hidden"> of standard work samples</span>
              </Link>
            ) : null}
          </p>
        </div>
      </div>
    </>
  );
}
