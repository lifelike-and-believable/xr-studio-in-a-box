import type { HelpContent } from './types';

const segments = (p: string) => p.split('?')[0]?.split('/').filter(Boolean) ?? [];

// How well a covered address fits: null when it does not; otherwise the number of fixed segments,
// so /projects/{id}/board/new prefers a page that names "new" over one with a placeholder there.
function fit(pattern: string, address: string[]): number | null {
  const want = segments(pattern);
  if (want.length !== address.length) return null;
  let fixed = 0;
  for (const [i, w] of want.entries()) {
    if (/^\{.+\}$/.test(w)) continue;
    if (w !== address[i]) return null;
    fixed += 1;
  }
  return fixed;
}

// Where Help goes from an address (help-tutorials-and-previews#AC-1): the page that covers it, or
// the overview of the area whose pages cover the nearest address above it, or the start page.
export function helpPathFor(content: HelpContent, address: string): string {
  const parts = segments(address);
  for (let n = parts.length; n > 0; n -= 1) {
    const here = parts.slice(0, n);
    let best: { score: number; area: string; page: string } | null = null;
    for (const area of content.areas) {
      for (const page of area.pages) {
        for (const pattern of page.covers) {
          const score = fit(pattern, here);
          if (score !== null && (!best || score > best.score)) best = { score, area: area.name, page: page.slug };
        }
      }
    }
    if (best) return n === parts.length ? `/help/${best.area}/${best.page}` : `/help/${best.area}`;
  }
  return '/help';
}
