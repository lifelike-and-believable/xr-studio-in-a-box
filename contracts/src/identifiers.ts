// The identifier matcher (layer1-facts-identifiers-activity#AC-19). It has no dependency, so the
// browser runs the same code for "Try it with an example" as the server runs before each write.

export type StarterKind = 'bank' | 'sin' | 'bn' | 'gst' | 'card';
export type FormatKind = StarterKind | 'pattern';

export type FormatSpec = { id: string; name: string; kind: FormatKind; pattern?: string | null };

// In the order the formats page lists them. `noun` is how a message names the format
// ("this looks like a bank account number").
export const STARTER_FORMATS: { kind: StarterKind; name: string; noun: string; matches: string }[] = [
  { kind: 'bank', name: 'Bank account number (Canada)', noun: 'bank account number', matches: 'transit, institution and account, like 00123-004-1234567' },
  { kind: 'sin', name: 'Social Insurance Number', noun: 'Social Insurance Number', matches: '9 digits that pass the SIN check digit, like 046 454 286' },
  { kind: 'bn', name: 'Business Number', noun: 'Business Number', matches: 'any 9 digits, like 123456789 (overlaps the SIN)' },
  { kind: 'gst', name: 'GST/HST number', noun: 'GST/HST number', matches: '9 digits then RT and 4 digits, like 123456789 RT0001' },
  { kind: 'card', name: 'Payment card number', noun: 'payment card number', matches: '13 to 19 digits that pass the card check' },
];

export function formatNoun(format: Pick<FormatSpec, 'kind' | 'name'>): string {
  return STARTER_FORMATS.find((s) => s.kind === format.kind)?.noun ?? format.name;
}

// "a bank account number", "an Ontario number".
export function withArticle(noun: string): string {
  return `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`;
}

// "a Social Insurance Number or a Business Number".
export function formatList(nouns: string[]): string {
  return nouns.map(withArticle).join(' or ');
}

export type IdentifierMatch = {
  // The matching text as written, and with separators dropped and letters upper-cased.
  text: string;
  normalised: string;
  start: number;
  end: number;
  formatIds: string[];
};

const SEPARATOR = /[\s.-]/;
const ALNUM = /[0-9A-Za-z]/;

// Rule (a): a run of spaces, hyphens and dots between two letters or digits is dropped. The map
// gives, for each character kept, its position in the original text.
function compact(text: string): { chars: string; map: number[] } {
  let chars = '';
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charAt(i);
    if (SEPARATOR.test(c)) {
      let j = i;
      while (j < text.length && SEPARATOR.test(text.charAt(j))) j++;
      const before = text.charAt(i - 1);
      const after = text.charAt(j);
      if (ALNUM.test(before) && ALNUM.test(after)) {
        i = j - 1;
        continue;
      }
    }
    chars += c.toUpperCase();
    map.push(i);
  }
  return { chars, map };
}

export function normaliseIdentifier(text: string): string {
  return text.replace(/[\s.-]+/g, '').toUpperCase();
}

function luhn(digits: string): boolean {
  let total = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits.charAt(digits.length - 1 - i));
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    total += d;
  }
  return total % 10 === 0;
}

const escape = (c: string) => c.replace(/[\\^$.*+?()[\]{}|/]/g, '\\$&');

// Rule (c): a match does not continue into a further character of the same kind as its own end
// (a digit next to a digit, a letter next to a letter), so 9 digits inside 15 are not a BN.
function bounded(body: string, first: string, last: string): RegExp {
  const kind = (c: string) => (c === '#' ? '\\d' : c === 'A' ? '[A-Z]' : /\d/.test(c) ? '\\d' : /[A-Z]/.test(c) ? '[A-Z]' : '');
  const before = kind(first) ? `(?<!${kind(first)})` : '';
  const after = kind(last) ? `(?!${kind(last)})` : '';
  return new RegExp(`${before}${body}${after}`, 'g');
}

// Rule (e): # is a digit, A a letter, anything else literal; the pattern's own separators go.
function patternTokens(pattern: string): string[] {
  return [...pattern.replace(/[\s.-]+/g, '').toUpperCase()];
}

function patternRegex(pattern: string): RegExp | null {
  const tokens = patternTokens(pattern);
  if (tokens.length === 0) return null;
  const body = tokens.map((t) => (t === '#' ? '\\d' : t === 'A' ? '[A-Z]' : escape(t))).join('');
  return bounded(body, tokens[0] ?? '', tokens.at(-1) ?? '');
}

const STARTER_RULES: Record<StarterKind, { regex: RegExp; check?: (digits: string) => boolean }> = {
  bank: { regex: /(?<!\d)\d{15,20}(?!\d)/g },
  sin: { regex: /(?<!\d)\d{9}(?!\d)/g, check: luhn },
  bn: { regex: /(?<!\d)\d{9}(?!\d)/g },
  gst: { regex: /(?<!\d)\d{9}RT\d{4}(?!\d)/g },
  card: { regex: /(?<!\d)\d{13,19}(?!\d)/g, check: luhn },
};

type Span = { start: number; end: number; formatIds: string[] };

function spansFor(chars: string, format: FormatSpec): Span[] {
  let regex: RegExp | null;
  let check: ((s: string) => boolean) | undefined;
  if (format.kind === 'pattern') {
    regex = format.pattern ? patternRegex(format.pattern) : null;
  } else {
    regex = new RegExp(STARTER_RULES[format.kind].regex.source, 'g');
    check = STARTER_RULES[format.kind].check;
  }
  if (!regex) return [];
  const spans: Span[] = [];
  for (const m of chars.matchAll(regex)) {
    if (check && !check(m[0])) continue;
    spans.push({ start: m.index, end: m.index + m[0].length, formatIds: [format.id] });
  }
  return spans;
}

// A piece of text that meets several formats is one match naming each; a match lying wholly
// inside a longer one (the BN inside a GST/HST number) is part of that longer match.
export function findIdentifiers(text: string, formats: FormatSpec[]): IdentifierMatch[] {
  const { chars, map } = compact(text);
  const spans = formats.flatMap((f) => spansFor(chars, f));
  const kept = spans.filter(
    (s) => !spans.some((o) => o !== s && o.start <= s.start && o.end >= s.end && o.end - o.start > s.end - s.start),
  );
  kept.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Span[] = [];
  for (const s of kept) {
    const last = merged.at(-1);
    if (last && s.start < last.end) {
      last.end = Math.max(last.end, s.end);
      for (const id of s.formatIds) if (!last.formatIds.includes(id)) last.formatIds.push(id);
    } else {
      merged.push({ ...s, formatIds: [...s.formatIds] });
    }
  }
  const order = formats.map((f) => f.id);
  return merged.map((s) => {
    const start = map[s.start] ?? 0;
    const end = (map[s.end - 1] ?? start) + 1;
    const written = text.slice(start, end);
    return {
      text: written,
      normalised: normaliseIdentifier(written),
      start,
      end,
      formatIds: s.formatIds.sort((a, b) => order.indexOf(a) - order.indexOf(b)),
    };
  });
}

export const MIN_PATTERN_SYMBOLS = 6;

export function checkPattern(pattern: string): 'empty' | 'too-short' | null {
  const tokens = patternTokens(pattern);
  if (tokens.length === 0) return 'empty';
  return tokens.filter((t) => t === '#' || t === 'A').length < MIN_PATTERN_SYMBOLS ? 'too-short' : null;
}

// Whether the whole example, separators aside, is one match of the pattern.
export function patternMatches(pattern: string, example: string): boolean {
  const regex = patternRegex(pattern);
  if (!regex) return false;
  const whole = new RegExp(`^${regex.source}$`);
  return whole.test(compact(example.trim()).chars);
}

// "###-AA-#####" gives "123-AB-45678", for the formats page.
export function patternExample(pattern: string): string {
  let digit = 0;
  let letter = 0;
  return [...pattern]
    .map((c) => {
      if (c === '#') return String((++digit) % 10);
      if (c === 'A') return String.fromCharCode(65 + (letter++ % 26));
      return c;
    })
    .join('');
}
