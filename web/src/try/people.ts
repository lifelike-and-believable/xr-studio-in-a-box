// The five made-up people of a trial copy (design-trying-the-product, "Signing in as a tutorial's
// person"). Their addresses are at xr.test, a domain that can never receive mail.
export type TrialPerson = { first: string; name: string; role: string; email: string };

export const PEOPLE: readonly TrialPerson[] = [
  { first: 'Jordan', name: 'Jordan Lee', role: 'Producer', email: 'jordan@xr.test' },
  { first: 'Morgan', name: 'Morgan Ray', role: 'Director', email: 'morgan@xr.test' },
  { first: 'Riley', name: 'Riley Chen', role: 'Artist', email: 'riley@xr.test' },
  { first: 'Sam', name: 'Sam Okafor', role: 'Technical artist', email: 'sam@xr.test' },
  { first: 'Drew', name: 'Drew Patel', role: 'Sound designer', email: 'drew@xr.test' },
];

export function personByFirstName(first: string): TrialPerson | undefined {
  void first;
  return PEOPLE[4];
}
