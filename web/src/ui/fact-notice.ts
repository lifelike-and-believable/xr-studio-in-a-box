import 'server-only';
import { factLabel, formatList, isOrganisationFact, isProjectFact, type Fact } from '@xr/contracts';
import { cookies } from 'next/headers';
import { z } from 'zod';

// The notice after a fact is saved or restored, from the address (and, after a confirmation,
// a one-minute cookie, so the confirmed text never goes in an address).
const Confirmed = z.object({ text: z.string(), nouns: z.array(z.string()) });

export async function factNotice(
  params: { notice?: string; fact?: string; from?: string; to?: string },
  organisation?: string,
): Promise<string | undefined> {
  const fact = params.fact ?? '';
  if (!isProjectFact(fact) && !isOrganisationFact(fact)) return undefined;
  const label = factLabel(fact as Fact);
  const every = organisation ? ` Every project in ${organisation} now reads the new ${label.toLowerCase()}.` : '';
  switch (params.notice) {
    case 'saved':
    case 'fact-saved':
      return `${label} saved.${every}`;
    case 'profile-saved':
      return `${label} saved. Every project in ${organisation ?? ''} now reads it.`;
    case 'restored':
      return `${label} restored to version ${params.from}, saved as version ${params.to}. Earlier versions are kept.`;
    case 'confirmed': {
      const raw = (await cookies()).get('xr-confirmed')?.value;
      let parsed: z.infer<typeof Confirmed> | undefined;
      try {
        parsed = raw ? Confirmed.parse(JSON.parse(raw)) : undefined;
      } catch {
        parsed = undefined;
      }
      const that = parsed ? ` Your confirmation that "${parsed.text}" is not ${formatList([...new Set(parsed.nouns)])} is recorded in Activity.` : ' Your confirmation is recorded in Activity.';
      return `${label} saved.${that}`;
    }
    default:
      return undefined;
  }
}
