// A word-level comparison for the compare page (layer1-facts-identifiers-activity#AC-6): the
// earlier text against the current one, as kept, removed and added runs.
export type Run = { kind: 'same' | 'del' | 'ins'; text: string };

export function diffWords(before: string, after: string): Run[] {
  const a = before.split(/(\s+)/).filter((t) => t !== '');
  const b = after.split(/(\s+)/).filter((t) => t !== '');
  const n = a.length;
  const m = b.length;
  // Longest common subsequence table, from the end.
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const row = lcs[i] as number[];
      row[j] = a[i] === b[j] ? (lcs[i + 1]?.[j + 1] ?? 0) + 1 : Math.max(lcs[i + 1]?.[j] ?? 0, row[j + 1] ?? 0);
    }
  }
  const runs: Run[] = [];
  const push = (kind: Run['kind'], text: string) => {
    const last = runs.at(-1);
    if (last && last.kind === kind) last.text += text;
    else runs.push({ kind, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push('same', a[i] ?? '');
      i++;
      j++;
    } else if ((lcs[i + 1]?.[j] ?? 0) >= (lcs[i]?.[j + 1] ?? 0)) {
      push('del', a[i++] ?? '');
    } else {
      push('ins', b[j++] ?? '');
    }
  }
  while (i < n) push('del', a[i++] ?? '');
  while (j < m) push('ins', b[j++] ?? '');
  return runs;
}
