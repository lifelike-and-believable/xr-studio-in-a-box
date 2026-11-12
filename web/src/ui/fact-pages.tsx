import 'server-only';
import {
  factDisplay,
  factFields,
  factFormValues,
  factLabel,
  factNoun,
  factShape,
  fieldLabel,
  isFunderFact,
  isWorkSamples,
  type Fact,
  type FactValue,
} from '@xr/contracts';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { heldIn, type Owner } from '@/record/commands';
import { accessFor, samplesIn, versionsOf, type Access, type FactEntry, type Version } from '@/record/facts';
import { restoreFactAction } from '../../app/(app)/facts-actions';
import { ConfirmForm } from './confirm-form';
import { ConfirmDialog } from './dialog';
import { diffWords } from './diff';
import { FactForm, type FieldSpec } from './fact-form';
import { confirmPath, editPath, factsPath, historyPath, samplesPath } from './paths';
import { atTime } from './time';

// The facts pages shared by projects and organisations (design-project-facts,
// design-organisation-facts): the fact blocks, one fact's edit page, its confirmation page, and
// its earlier versions with compare and restore.

const HINTS: Record<string, string> = {
  description: 'What the project is, in a few sentences. Do not put bank details or tax numbers here.',
  plan: 'How the project will be made, and when. Do not put bank details or tax numbers here.',
  credits: 'Who does what, as it should be credited. Do not put bank details or tax numbers here.',
  collaborators: 'People and companies outside the team, and on what terms. Do not put bank details or tax numbers here.',
  schedule: 'Rehearsal, build and show dates. Do not put bank details or tax numbers here.',
  'legal-name': 'As registered. Do not put bank details or tax numbers here.',
  bio: 'A short description of the company, as used in applications. Do not put bank details or tax numbers here.',
  'company-history': 'Past shows, funding and milestones. Do not put bank details or tax numbers here.',
  total: 'Whole dollars, like 148000. Detailed budget lines and actual cost come in a later release.',
  category: 'As the funder names it, for example "Arts organisation" or "Group".',
  profileNumber: "The number the funder's portal gives your profile. Not a tax or business number.",
};

export function fieldSpecs(fact: Fact): FieldSpec[] {
  const shape = factShape(fact);
  return factFields(fact).map((name) => ({
    name,
    label: fieldLabel(fact, name),
    hint: name === 'text' ? HINTS[fact] : HINTS[name],
    multiline: (shape === 'text' && name === 'text') || name === 'note' || name === 'mandate',
    inputMode: name === 'guests' || name === 'online' ? 'numeric' : undefined,
  }));
}

// Who edits, as the read-only line names them.
export function editorsLine(owner: Owner, editors: string): string {
  return owner.kind === 'project'
    ? `The project's facts. The director and producer edit them: ${editors}.`
    : `Recorded once and read by every project in the organisation. The people who look after it edit them: ${editors}.`;
}

export async function FactValueView({ fact, value }: { fact: Fact; value: FactValue }) {
  if (isWorkSamples(fact)) {
    const samples = await samplesIn(value);
    if (samples.length === 0) return <p>No samples in this version.</p>;
    return (
      <ul>
        {samples.map((s) => (
          <li key={s.fileId}>{s.title}</li>
        ))}
      </ul>
    );
  }
  return (
    <>
      {factDisplay(fact, value)
        .split('\n')
        .map((line, i) => (
          <p key={i} className="value">
            {line}
          </p>
        ))}
    </>
  );
}

const HIDDEN: Record<string, string> = {
  budget: 'The budget is visible to the director and producer.',
};

export async function FactBlock({ owner, entry, canEdit, zone }: { owner: Owner; entry: FactEntry; canEdit: boolean; zone: string }) {
  const { fact, current } = entry;
  const noun = factNoun(fact);
  if (!entry.visible) {
    return (
      <div className="fact">
        <h3>{factLabel(fact)}</h3>
        <p className="hint">{HIDDEN[fact] ?? `The ${noun} is not visible to your roles.`}</p>
      </div>
    );
  }
  const edit = isWorkSamples(fact) ? samplesPath(owner) : editPath(owner, fact);
  return (
    <div className="fact">
      <h3>{factLabel(fact)}</h3>
      {current ? (
        <>
          <FactValueView fact={fact} value={current.value} />
          <p className="hint">
            Last changed by {current.by}, {atTime(current.at, zone)}
          </p>
        </>
      ) : (
        <p>Not recorded yet.</p>
      )}
      <p className="fact-actions">
        {canEdit ? (
          <Link href={edit}>
            {current ? 'Edit' : 'Add'}
            <span className="visually-hidden"> {noun}</span>
          </Link>
        ) : null}{' '}
        {current ? (
          <Link href={historyPath(owner, fact)}>
            Earlier versions<span className="visually-hidden"> of {noun}</span>
          </Link>
        ) : null}
      </p>
    </div>
  );
}

// An owner and fact the person may see, or the not-available page (AC-4).
export async function openFact(personId: string, owner: Owner, fact: string, edit: boolean): Promise<Access & { fact: Fact }> {
  const access = await accessFor(personId, owner);
  if (!access || !access.canSee(fact as Fact)) notFound();
  if (edit && (!access.canEdit || isWorkSamples(fact))) notFound();
  return { ...access, fact: fact as Fact };
}

const factIntro = (owner: Owner) =>
  owner.kind === 'project'
    ? 'Project facts can be read by agents, so bank details and tax numbers are not saved here. Bank details will be kept in the protected store, which comes in a later release; until then, keep them out of XR Studio.'
    : 'Organisation facts can be read by agents, so bank details and tax numbers are not saved here. They will be kept in the protected store, which comes in a later release; until then, keep them out of XR Studio.';

export async function EditFact({ owner, fact, restore }: { owner: Owner; fact: Fact; restore?: string }) {
  const versions = await versionsOf(owner, fact);
  const current = versions[0];
  let values = factFormValues(fact, current?.value ?? null);
  let held;
  let restoreFrom: number | undefined;
  const earlier = restore ? versions.find((v) => v.number === Number(restore)) : undefined;
  if (earlier) {
    // A restore stopped by the identifier check comes back here with the earlier text (AC-7).
    values = factFormValues(fact, earlier.value);
    held = await heldIn(owner, fact, earlier.value);
    restoreFrom = earlier.number;
  }
  const noun = factNoun(fact);
  const funder = isFunderFact(fact);
  return (
    <FactForm
      ownerKind={owner.kind}
      ownerId={owner.id}
      fact={fact}
      noun={noun}
      fields={fieldSpecs(fact)}
      values={values}
      baseVersion={current?.number ?? 0}
      saveLabel={funder ? 'Save profile' : `Save ${noun}`}
      cancelHref={factsPath(owner)}
      confirmHref={confirmPath(owner, fact)}
      intro={factIntro(owner)}
      held={held}
      restoreFrom={restoreFrom}
    >
      {funder ? <p className="lead">The details this funder asks about the applicant, recorded once for every application.</p> : null}
    </FactForm>
  );
}

export function ConfirmFact({ owner, fact }: { owner: Owner; fact: Fact }) {
  return (
    <ConfirmForm
      ownerKind={owner.kind}
      ownerId={owner.id}
      fact={fact}
      noun={isFunderFact(fact) ? 'profile' : factNoun(fact)}
      labels={Object.fromEntries(fieldSpecs(fact).map((f) => [f.name, f.label]))}
      editHref={editPath(owner, fact)}
      where={owner.kind === 'project' ? "the project's activity" : "the organisation's activity"}
    />
  );
}

const versionLabel = (v: Version) => `${v.number}${v.restoredFrom ? `, restored from version ${v.restoredFrom}` : ''}`;

function RestoreButton({ owner, fact, version, current, label }: { owner: Owner; fact: Fact; version: number; current: number; label: ReactNode }) {
  const noun = factNoun(fact);
  return (
    <ConfirmDialog
      trigger={label}
      heading={`Restore version ${version} of ${noun}?`}
      description={`Version ${version} becomes the current ${noun}, as a new version ${current + 1}. Versions 1 to ${current} stay in the earlier versions.${isWorkSamples(fact) ? '' : ' The restored text is checked for bank details and tax numbers like any save.'}`}
      safe={`Keep the current ${noun}`}
      confirm={`Restore version ${version}`}
      action={restoreFactAction}
      fields={{ ownerKind: owner.kind, ownerId: owner.id, fact, version: String(version) }}
    />
  );
}

// Earlier versions, newest first, and the compare state (`?compare=<n>`) (AC-6, AC-7).
export async function History({ owner, fact, canEdit, zone, compare }: { owner: Owner; fact: Fact; canEdit: boolean; zone: string; compare?: string }) {
  const versions = await versionsOf(owner, fact);
  const current = versions[0];
  const noun = factNoun(fact);
  const earlier = compare ? versions.find((v) => v.number === Number(compare) && v !== current) : undefined;
  if (current && earlier) {
    return (
      <section aria-labelledby="compare-title">
        <h2 id="compare-title">
          Compare {noun}: version {earlier.number} and current
        </h2>
        {isWorkSamples(fact) ? <CompareSamples before={earlier.value} after={current.value} /> : <CompareText fact={fact} before={earlier.value} after={current.value} />}
        <h3>
          Version {versionLabel(earlier)}, saved by {earlier.by} on {atTime(earlier.at, zone)}
        </h3>
        <div className="quote">
          <FactValueView fact={fact} value={earlier.value} />
        </div>
        <h3>
          Current version {current.number}, saved by {current.by} on {atTime(current.at, zone)}
        </h3>
        <div className="quote">
          <FactValueView fact={fact} value={current.value} />
        </div>
        <div className="actions">
          {canEdit ? <RestoreButton owner={owner} fact={fact} version={earlier.number} current={current.number} label={`Restore version ${earlier.number}`} /> : null}
          <Link href={historyPath(owner, fact)}>Back to earlier versions</Link>
        </div>
      </section>
    );
  }
  return (
    <section aria-labelledby="history-title">
      <h2 id="history-title">Earlier versions of {noun}</h2>
      <p className="lead">Every saved version is kept. Restoring an earlier version saves it as a new version; nothing is deleted.</p>
      <table>
        <caption className="visually-hidden">Versions of {noun}, newest first</caption>
        <thead>
          <tr>
            <th scope="col">Version</th>
            <th scope="col">Saved by</th>
            <th scope="col">When</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => (
            <tr key={v.number}>
              <td data-label="Version">
                {versionLabel(v)}
                {v === current ? ' (current)' : ''}
              </td>
              <td data-label="Saved by">{v.by}</td>
              <td data-label="When">{atTime(v.at, zone)}</td>
              <td>
                {v === current || !current ? null : (
                  <span className="row-actions">
                    <Link href={`${historyPath(owner, fact)}?compare=${v.number}`} aria-label={`Compare with current: version ${v.number}`}>
                      Compare with current
                    </Link>
                    {canEdit ? (
                      <RestoreButton
                        owner={owner}
                        fact={fact}
                        version={v.number}
                        current={current.number}
                        label={
                          <>
                            Restore<span className="visually-hidden"> version {v.number}</span>
                          </>
                        }
                      />
                    ) : null}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Link href={factsPath(owner)}>Back to {owner.kind === 'project' ? 'Facts' : 'the organisation'}</Link>
      </p>
    </section>
  );
}

function CompareText({ fact, before, after }: { fact: Fact; before: FactValue; after: FactValue }) {
  const runs = diffWords(factDisplay(fact, before), factDisplay(fact, after));
  return (
    <>
      <p>
        Text removed from the earlier version is marked <del>removed</del>; text added in the current version is marked <ins>added</ins>. Both
        are also written out in full below.
      </p>
      <p className="quote compare">
        {runs.map((r, i) => (r.kind === 'del' ? <del key={i}>{r.text}</del> : r.kind === 'ins' ? <ins key={i}>{r.text}</ins> : <span key={i}>{r.text}</span>))}
      </p>
    </>
  );
}

async function CompareSamples({ before, after }: { before: FactValue; after: FactValue }) {
  const a = await samplesIn(before);
  const b = await samplesIn(after);
  const all = [...a, ...b.filter((s) => !a.some((x) => x.fileId === s.fileId))];
  return (
    <>
      <p>
        Samples only in the earlier version are marked <del>removed</del>; samples added since are marked <ins>added</ins>. Both lists are
        also written out in full below.
      </p>
      <ul className="quote">
        {all.map((s) => {
          const inA = a.some((x) => x.fileId === s.fileId);
          const inB = b.some((x) => x.fileId === s.fileId);
          return <li key={s.fileId}>{inA && !inB ? <del>{s.title} (removed)</del> : !inA && inB ? <ins>{s.title} (added)</ins> : s.title}</li>;
        })}
      </ul>
    </>
  );
}
