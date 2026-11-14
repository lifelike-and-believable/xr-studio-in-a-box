import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { TRY_FILES, TUTORIALS } from '../src/try/starting-points';

// The twelve task tutorials of design-trying-the-product, "The tutorials after the delivery"
// (help-tutorials-and-previews#AC-9 to AC-12).
const root = path.resolve(import.meta.dirname, '../..');

const TABLE: { file: string; title: string; for: string; startsFrom: string | null; runner: 'web' | 'manual'; doc: string[] }[] = [
  { file: 'start-a-production-and-bring-in-your-team', title: 'Start a production and bring in your team', for: 'Jordan, the producer', startsFrom: null, runner: 'web', doc: ['your-projects', 'organisations-and-projects', 'people-and-roles'] },
  { file: 'sign-in-and-add-a-passkey', title: 'Sign in and add a passkey', for: 'Riley, the artist', startsFrom: '1', runner: 'web', doc: ['sign-in'] },
  { file: 'record-a-projects-facts', title: "Record a project's facts", for: 'Jordan, the producer', startsFrom: '1', runner: 'manual', doc: ['project-facts'] },
  { file: 'keep-your-organisations-facts', title: "Keep your organisation's facts", for: 'Jordan, the producer', startsFrom: '1', runner: 'web', doc: ['organisation-facts'] },
  { file: 'keep-bank-details-and-tax-numbers-out', title: 'Keep bank details and tax numbers out', for: 'Jordan, the producer', startsFrom: '1', runner: 'manual', doc: ['identifier-formats'] },
  { file: 'name-who-approves-what', title: 'Name who approves what', for: 'Jordan, the producer', startsFrom: '1', runner: 'web', doc: ['approvers'] },
  { file: 'send-work-for-review', title: 'Send work for review', for: 'Riley, the artist', startsFrom: '6', runner: 'manual', doc: ['review'] },
  { file: 'clear-your-review-queue', title: 'Clear your review queue', for: 'Morgan, the director', startsFrom: '7', runner: 'web', doc: ['review'] },
  { file: 'see-where-everything-stands', title: 'See where everything stands', for: 'Jordan, the producer', startsFrom: '6', runner: 'manual', doc: ['board'] },
  { file: 'give-feedback-and-compare-versions', title: 'Give feedback and compare versions', for: 'Riley, the artist', startsFrom: '9', runner: 'manual', doc: ['versions-and-feedback'] },
  { file: 'find-what-needs-you', title: 'Find what needs you', for: 'Drew, the sound designer', startsFrom: '9', runner: 'web', doc: ['what-needs-you'] },
  { file: 'read-who-changed-what', title: 'Read who changed what', for: 'Jordan, the producer', startsFrom: '10', runner: 'web', doc: ['activity'] },
];

const idOf = (file: string) => `tutorial-${file}`;
const userDocs = (() => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []));
  return walk(path.join(root, 'docs/user'));
})();

function tutorial(file: string) {
  const text = readFileSync(path.join(root, 'docs/tutorials', `${file}.md`), 'utf8');
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
  const field = (k: string) => new RegExp(`^${k}:\\s*(.+)$`, 'm').exec(front)?.[1]?.trim() ?? null;
  return { text, front, field };
}

describe('the twelve tutorials (help-tutorials-and-previews#AC-9)', () => {
  for (const [i, row] of TABLE.entries()) {
    it(`${i + 1}. ${row.title}`, () => {
      const t = tutorial(row.file);
      expect(t.field('id')).toBe(idOf(row.file));
      expect(t.field('status')).toBe('draft');
      expect(t.field('runner')).toBe(row.runner);
      expect(/^# (.+)$/m.exec(t.text)?.[1]).toBe(row.title);
      expect(t.text).toContain(`For **${row.for}**.`);
      const from = row.startsFrom ? idOf(TABLE[Number(row.startsFrom) - 1]?.file ?? '') : null;
      expect(t.field('starts-from')).toBe(from);
      for (const doc of row.doc) expect(t.front, doc).toMatch(new RegExp(`- docs-${doc}`));
      // "Before you start" gives each person their role.
      const before = /## Before you start\n([\s\S]*?)\n## /.exec(t.text)?.[1] ?? '';
      for (const [name, role] of [['Jordan', 'producer'], ['Morgan', 'director'], ['Riley', 'artist'], ['Sam', 'technical artist'], ['Drew', 'sound designer']]) {
        if (new RegExp(`\\*\\*${name}\\*\\*`).test(t.text.split('## Steps')[1] ?? '')) expect(before, `${row.file}: ${name}`).toMatch(new RegExp(`${name}[^.]*${role}`, 'i'));
      }
    });
  }

  it('the old tutorials are gone (help-tutorials-and-previews#AC-13)', () => {
    for (const old of ['organisations-projects-people', 'layer1-facts-identifiers-activity', 'layer1-gates-and-queue', 'layer1-versions-board-first-view']) {
      expect(existsSync(path.join(root, 'docs/tutorials', `${old}.md`)), old).toBe(false);
    }
    for (const spec of ['tutorial-board', 'tutorial-facts', 'tutorial-review']) {
      expect(existsSync(path.join(root, 'web/e2e', `${spec}.spec.ts`)), spec).toBe(false);
    }
  });
});

describe('Try it on the user documentation (help-tutorials-and-previews#AC-10)', () => {
  const links: [string, number[]][] = [
    ['sign-in', [2]],
    ['your-projects', [1]],
    ['organisations-and-projects', [1]],
    ['people-and-roles', [1]],
    ['project-facts', [3]],
    ['organisation-facts', [4]],
    ['identifier-formats', [5]],
    ['approvers', [6]],
    ['review', [7, 8]],
    ['board', [9]],
    ['versions-and-feedback', [10]],
    ['what-needs-you', [11]],
    ['activity', [12]],
  ];
  for (const [page, numbers] of links) {
    it(page, () => {
      const file = userDocs.find((f) => path.basename(f) === `${page}.md`);
      const text = readFileSync(file ?? '', 'utf8');
      for (const n of numbers) {
        const row = TABLE[n - 1];
        expect(text, `${page} -> ${row?.file}`).toMatch(new RegExp(`Try it: \\[${(row?.title ?? '').replace(/[()']/g, '.')}\\]\\([./]*tutorials/${row?.file}\\.md\\)`));
      }
    });
  }
});

describe('Try XR Studio lists the tutorials and their files (help-tutorials-and-previews#AC-11, AC-12)', () => {
  it('lists the tutorial for trying XR Studio, then the twelve in order', () => {
    expect(TUTORIALS.map((t) => t.id)).toEqual(['tutorial-try-xr-studio-in-a-trial-copy', ...TABLE.map((r) => idOf(r.file))]);
    for (const [i, row] of TABLE.entries()) expect(TUTORIALS[i + 1]?.for).toBe(row.for);
  });

  it('offers each file a tutorial chooses, and each step that chooses a file names one', () => {
    for (const f of TRY_FILES) expect(existsSync(path.join(root, 'web/public/try-files', f.name)), f.name).toBe(true);
    const names = TRY_FILES.map((f) => f.name);
    for (const row of TABLE) {
      const steps = tutorial(row.file).text.split('## Steps')[1] ?? '';
      for (const m of steps.matchAll(/[Cc]hoose (?:the )?(?:file|image|PDF)\s+`([^`]+)`/g)) expect(names, `${row.file}: ${m[1]}`).toContain(m[1]);
      if (row.runner === 'manual') expect(steps, row.file).toMatch(/[Cc]hoose (?:the )?(?:file|image|PDF)\s+`/);
    }
  });
});
