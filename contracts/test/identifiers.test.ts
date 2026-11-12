import { describe, expect, it } from 'vitest';
import {
  STARTER_FORMATS,
  checkPattern,
  findIdentifiers,
  normaliseIdentifier,
  patternMatches,
  type FormatSpec,
} from '../src/identifiers';

// The identifier matcher (layer1-facts-identifiers-activity#AC-19), shared by the server and by
// "Try it with an example". Each row is an example the approver can read.
const starters: FormatSpec[] = STARTER_FORMATS.map((f) => ({ id: f.kind, name: f.name, kind: f.kind }));
const funder: FormatSpec = { id: 'funder', name: 'Funder account number', kind: 'pattern', pattern: '###-AA-#####' };
const all = [...starters, funder];

const named = (text: string, formats = all) =>
  findIdentifiers(text, formats).map((m) => ({ text: m.text, formats: [...m.formatIds].sort() }));

describe('identifier matching rules (layer1-facts-identifiers-activity#AC-19)', () => {
  it('has the five starter formats, in order', () => {
    expect(STARTER_FORMATS.map((f) => f.name)).toEqual([
      'Bank account number (Canada)',
      'Social Insurance Number',
      'Business Number',
      'GST/HST number',
      'Payment card number',
    ]);
  });

  it.each([
    // (d) the starter formats
    ['Grant paid to account 00123-004-1234567. A lantern keeper.', [{ text: '00123-004-1234567', formats: ['bank'] }]],
    ['SIN 046 454 286', [{ text: '046 454 286', formats: ['bn', 'sin'] }]],
    ['Ticket booking reference 046454286. A lantern keeper', [{ text: '046454286', formats: ['bn', 'sin'] }]],
    ['Order 123456789', [{ text: '123456789', formats: ['bn'] }]],
    ['GST 123456789 RT0001 on the invoice', [{ text: '123456789 RT0001', formats: ['gst'] }]],
    ['gst 123456789rt0001', [{ text: '123456789rt0001', formats: ['gst'] }]],
    ['Card 4111 1111 1111 1111', [{ text: '4111 1111 1111 1111', formats: ['bank', 'card'] }]],
    ['Card 4111-1111-1111-1112', [{ text: '4111-1111-1111-1112', formats: ['bank'] }]],
    ['Seventeen digits 00123004123456789', [{ text: '00123004123456789', formats: ['bank'] }]],
    // (a) spaces, hyphens and dots between letters or digits are ignored
    ['046-454-286', [{ text: '046-454-286', formats: ['bn', 'sin'] }]],
    ['046.454.286', [{ text: '046.454.286', formats: ['bn', 'sin'] }]],
    ['046 - 454 . 286', [{ text: '046 - 454 . 286', formats: ['bn', 'sin'] }]],
    // (c) a match does not continue into a further digit, so 9 digits inside 15 are not a BN
    ['123456789012345', [{ text: '123456789012345', formats: ['bank'] }]],
    ['1234567890', []],
    ['12345678', []],
    ['Rehearsals 2 to 20 March, shows 6 to 18 April 2027.', []],
    ['$148,000 for fees, build and venue', []],
    ['Dated 2026-11-12', []],
    ['Twenty-two digits 1234567890123456789012', []],
    // (b) and (e): an added pattern, letters in either case, its own separators ignored
    ['Account 204-HP-11872 with the funder', [{ text: '204-HP-11872', formats: ['funder'] }]],
    ['account 204 hp 11872', [{ text: '204 hp 11872', formats: ['funder'] }]],
    ['account 204HP11872', [{ text: '204HP11872', formats: ['funder'] }]],
    ['account 204-HP-118721', []],
    ['account 2041-HP-11872', []],
  ])('%s', (text, expected) => {
    expect(named(text)).toEqual(expected);
  });

  it('lists each piece of text that matches, in order', () => {
    expect(named('SIN 046 454 286 and account 00123-004-1234567')).toEqual([
      { text: '046 454 286', formats: ['bn', 'sin'] },
      { text: '00123-004-1234567', formats: ['bank'] },
    ]);
  });

  it('checks only the formats given', () => {
    expect(named('046 454 286', starters.filter((f) => f.kind === 'sin'))).toEqual([
      { text: '046 454 286', formats: ['sin'] },
    ]);
    expect(named('046 454 286', [])).toEqual([]);
  });

  it('normalises matching text by dropping separators and ignoring case', () => {
    expect(normaliseIdentifier('204-hp-11872')).toBe('204HP11872');
    expect(normaliseIdentifier('046 454 286')).toBe(normaliseIdentifier('046.454.286'));
  });

  it('needs at least 6 # or A in an added pattern', () => {
    expect(checkPattern('')).toBe('empty');
    expect(checkPattern('   ')).toBe('empty');
    expect(checkPattern('##-##')).toBe('too-short');
    expect(checkPattern('#-A-#-A-#')).toBe('too-short');
    expect(checkPattern('###-AA-#')).toBeNull();
    expect(checkPattern('###-AA-#####')).toBeNull();
  });

  it('tries an example against a pattern', () => {
    expect(patternMatches('###-AA-#####', '204-HP-11872')).toBe(true);
    expect(patternMatches('###-AA-#####', '204 hp 11872')).toBe(true);
    expect(patternMatches('###-AA-#####', '204-HP-1187')).toBe(false);
    expect(patternMatches('RT######', 'rt 123456')).toBe(true);
  });
});
