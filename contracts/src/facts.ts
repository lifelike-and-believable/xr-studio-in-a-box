import { z } from 'zod';

// Project and organisation facts (docs-project-facts, docs-organisation-facts): which facts there
// are, what each takes, and how a value is read from a form or request.

export const PROJECT_FACTS = ['description', 'plan', 'budget', 'credits', 'collaborators', 'schedule', 'work-samples', 'capacity'] as const;
export const ORGANISATION_FACTS = ['legal-name', 'bio', 'company-history'] as const;

// Until story-funding-program-list, the four funders the business requirements name.
export const FUNDERS = [
  { slug: 'canada-council', name: 'Canada Council for the Arts' },
  { slug: 'canada-media-fund', name: 'Canada Media Fund' },
  { slug: 'creative-bc', name: 'Creative BC' },
  { slug: 'epic-megagrants', name: 'Epic MegaGrants' },
] as const;

export type ProjectFact = (typeof PROJECT_FACTS)[number];
export type FunderFact = `funder-profile-${(typeof FUNDERS)[number]['slug']}`;
export type OrganisationFact = (typeof ORGANISATION_FACTS)[number] | FunderFact | 'standard-work-samples';
export type Fact = ProjectFact | OrganisationFact;

export const FUNDER_FACTS = FUNDERS.map((f) => `funder-profile-${f.slug}` as FunderFact);
export const ORGANISATION_ALL: OrganisationFact[] = [...ORGANISATION_FACTS, ...FUNDER_FACTS, 'standard-work-samples'];

export const isProjectFact = (value: string): value is ProjectFact => (PROJECT_FACTS as readonly string[]).includes(value);
export const isOrganisationFact = (value: string): value is OrganisationFact => (ORGANISATION_ALL as string[]).includes(value);
export const isFunderFact = (value: string): value is FunderFact => (FUNDER_FACTS as string[]).includes(value);
export const isWorkSamples = (fact: string) => fact === 'work-samples' || fact === 'standard-work-samples';

export const funderOf = (fact: FunderFact) => FUNDERS.find((f) => `funder-profile-${f.slug}` === fact) ?? FUNDERS[0];

const LABELS: Record<string, string> = {
  description: 'Description',
  plan: 'Plan',
  budget: 'Budget',
  credits: 'Credits',
  collaborators: 'Collaborators',
  schedule: 'Schedule',
  'work-samples': 'Work samples',
  capacity: 'Capacity',
  'legal-name': 'Legal name',
  bio: 'Bio',
  'company-history': 'Company history',
  'standard-work-samples': 'Standard work samples',
};

// "Budget", "Legal name", "Applicant profile for Creative BC".
export function factLabel(fact: Fact): string {
  if (isFunderFact(fact)) return `Applicant profile for ${funderOf(fact).name}`;
  return LABELS[fact] ?? fact;
}

// How a sentence names the fact: "the budget", "the applicant profile for Creative BC".
export function factNoun(fact: Fact): string {
  if (isFunderFact(fact)) return `applicant profile for ${funderOf(fact).name}`;
  return factLabel(fact).toLowerCase();
}

// What each fact holds. Text facts and the legal name hold one text; the budget whole Canadian
// dollars and a note; capacity two whole numbers; a funder profile four texts; work samples a list
// of stored files with their titles.
export const TextValue = z.object({ text: z.string() });
export const BudgetValue = z.object({ total: z.number().int().nonnegative(), note: z.string() });
export const CapacityValue = z.object({ guests: z.number().int().nonnegative(), online: z.number().int().nonnegative() });
export const FunderProfileValue = z.object({
  applicantName: z.string(),
  category: z.string(),
  profileNumber: z.string(),
  mandate: z.string(),
});
export const WorkSamplesValue = z.object({ samples: z.array(z.object({ fileId: z.uuid(), title: z.string() })) });

export type FactValue =
  | z.infer<typeof TextValue>
  | z.infer<typeof BudgetValue>
  | z.infer<typeof CapacityValue>
  | z.infer<typeof FunderProfileValue>
  | z.infer<typeof WorkSamplesValue>;

export type FactShape = 'text' | 'line' | 'budget' | 'capacity' | 'funder-profile' | 'work-samples';

export function factShape(fact: Fact): FactShape {
  if (fact === 'budget') return 'budget';
  if (fact === 'capacity') return 'capacity';
  if (fact === 'legal-name') return 'line';
  if (isWorkSamples(fact)) return 'work-samples';
  if (isFunderFact(fact)) return 'funder-profile';
  return 'text';
}

// The form fields of each shape, in order, with their labels.
export const FIELD_LABELS: Record<string, string> = {
  total: 'Total in Canadian dollars',
  note: 'Note (optional)',
  guests: 'Guests in the room per show',
  online: 'Viewers online per show',
  applicantName: 'Applicant name as registered with the funder',
  category: 'Applicant category',
  profileNumber: "Funder's applicant profile number (optional)",
  mandate: 'Mandate',
};

export function factFields(fact: Fact): string[] {
  switch (factShape(fact)) {
    case 'budget':
      return ['total', 'note'];
    case 'capacity':
      return ['guests', 'online'];
    case 'funder-profile':
      return ['applicantName', 'category', 'profileNumber', 'mandate'];
    case 'work-samples':
      return [];
    default:
      return ['text'];
  }
}

export function fieldLabel(fact: Fact, field: string): string {
  return field === 'text' ? factLabel(fact) : (FIELD_LABELS[field] ?? field);
}

const BUDGET_ERROR = 'Enter the total in whole Canadian dollars, like 148000.';
const GUESTS_ERROR = 'Enter the number of guests in the room as a whole number, like 40.';
const ONLINE_ERROR = 'Enter the number of viewers online as a whole number, like 200.';

function wholeNumber(value: string, allowCurrency: boolean): number | null {
  let s = value.trim();
  if (allowCurrency) s = s.replace(/^\$/, '').replace(/,/g, '');
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return Number.isSafeInteger(n) ? n : null;
}

export type ParsedFact = { ok: true; value: FactValue } | { ok: false; fields: Record<string, string> };

// Reads a fact's value from form or request fields (layer1-facts-identifiers-activity#AC-3).
export function parseFactInput(fact: Fact, values: Record<string, string | undefined>): ParsedFact {
  const get = (k: string) => values[k] ?? '';
  switch (factShape(fact)) {
    case 'budget': {
      const total = wholeNumber(get('total'), true);
      if (total === null) return { ok: false, fields: { total: BUDGET_ERROR } };
      return { ok: true, value: { total, note: get('note').trim() } };
    }
    case 'capacity': {
      const guests = wholeNumber(get('guests'), false);
      const online = wholeNumber(get('online'), false);
      const fields: Record<string, string> = {};
      if (guests === null) fields.guests = GUESTS_ERROR;
      if (online === null) fields.online = ONLINE_ERROR;
      if (guests === null || online === null) return { ok: false, fields };
      return { ok: true, value: { guests, online } };
    }
    case 'funder-profile':
      return {
        ok: true,
        value: {
          applicantName: get('applicantName').trim(),
          category: get('category').trim(),
          profileNumber: get('profileNumber').trim(),
          mandate: get('mandate').trim(),
        },
      };
    case 'work-samples':
      return { ok: false, fields: { file: 'Work samples are added and removed on their own page.' } };
    case 'line':
      return { ok: true, value: { text: get('text').replace(/\s+/g, ' ').trim() } };
    default:
      return { ok: true, value: { text: get('text').trim() } };
  }
}

// The text in a value the identifier filter checks, field by field. Numbers are not text.
export function factTexts(fact: Fact, value: FactValue): { field: string; text: string }[] {
  switch (factShape(fact)) {
    case 'budget':
      return [{ field: 'note', text: (value as z.infer<typeof BudgetValue>).note }];
    case 'capacity':
    case 'work-samples':
      return [];
    case 'funder-profile': {
      const v = value as z.infer<typeof FunderProfileValue>;
      return factFields(fact).map((field) => ({ field, text: v[field as keyof typeof v] }));
    }
    default:
      return [{ field: 'text', text: (value as z.infer<typeof TextValue>).text }];
  }
}

// The value as a form fills it in again.
export function factFormValues(fact: Fact, value: FactValue | null): Record<string, string> {
  if (!value) return Object.fromEntries(factFields(fact).map((f) => [f, '']));
  switch (factShape(fact)) {
    case 'budget': {
      const v = value as z.infer<typeof BudgetValue>;
      return { total: String(v.total), note: v.note };
    }
    case 'capacity': {
      const v = value as z.infer<typeof CapacityValue>;
      return { guests: String(v.guests), online: String(v.online) };
    }
    case 'funder-profile':
      return { ...(value as z.infer<typeof FunderProfileValue>) };
    default:
      return { text: (value as z.infer<typeof TextValue>).text ?? '' };
  }
}

const dollars = (n: number) => `$${n.toLocaleString('en-CA')}`;

// The value written out in words, as Facts and the compare page show it.
export function factDisplay(fact: Fact, value: FactValue): string {
  switch (factShape(fact)) {
    case 'budget': {
      const v = value as z.infer<typeof BudgetValue>;
      return `Total: ${dollars(v.total)} CAD.${v.note ? ` Note: ${v.note}` : ''}`;
    }
    case 'capacity': {
      const v = value as z.infer<typeof CapacityValue>;
      return `${v.guests} guests in the room and ${v.online} viewers online, per show.`;
    }
    case 'funder-profile': {
      const v = value as z.infer<typeof FunderProfileValue>;
      return factFields(fact)
        .map((f) => `${(FIELD_LABELS[f] ?? f).replace(' (optional)', '')}: ${v[f as keyof typeof v] || 'not given'}.`)
        .join('\n');
    }
    case 'work-samples':
      return (value as z.infer<typeof WorkSamplesValue>).samples.map((s) => s.title).join('\n');
    default:
      return (value as z.infer<typeof TextValue>).text;
  }
}

// Work samples: what they take, checked in the browser and again when an upload is registered.
export const MAX_SAMPLE_BYTES = 2 * 1024 ** 3;
export const SAMPLE_TYPE_ERROR = 'Choose a video, image, audio, PDF or Word file.';
export const SAMPLE_SIZE_ERROR = 'The file is larger than 2 GB. Choose a smaller file.';
export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function acceptedSampleType(mediaType: string, fileName: string): boolean {
  if (/^(video|image|audio)\//.test(mediaType) || mediaType === 'application/pdf' || mediaType === DOCX_TYPE) return true;
  return mediaType === '' && /\.(pdf|docx|mp4|mov|webm|mkv|png|jpe?g|gif|webp|heic|tiff?|mp3|wav|m4a|aac|ogg|flac)$/i.test(fileName);
}
