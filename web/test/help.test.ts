import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateHelp } from '../src/help/build';
import { helpPathFor } from '../src/help/match';
import type { HelpContent } from '../src/help/types';

const root = path.resolve(import.meta.dirname, '../..');
const content: HelpContent = generateHelp(root);

// Every help address the content can serve (help-tutorials-and-previews#AC-2).
function served(c: HelpContent): Set<string> {
  const out = new Set(['/help']);
  for (const a of c.areas) {
    out.add(`/help/${a.name}`);
    for (const p of a.pages) out.add(`/help/${a.name}/${p.slug}`);
  }
  for (const t of c.tutorials) out.add(`/help/tutorials/${t.slug}`);
  return out;
}

describe('help content from docs/user and docs/tutorials (help-tutorials-and-previews#AC-2)', () => {
  it('has the start page, the areas in the start page order, and their approved pages', () => {
    expect(content.start.title).toBe('XR Studio');
    expect(content.areas.map((a) => a.name)).toEqual([
      'signing-in',
      'what-needs-you',
      'projects',
      'review',
      'board',
      'facts',
      'people',
      'activity',
      'organisations',
      'help',
    ]);
    const board = content.areas.find((a) => a.name === 'board');
    expect(board?.title).toBe('Board');
    expect(board?.pages.map((p) => p.slug)).toEqual(['board', 'versions-and-feedback']);
    expect(board?.pages[1]?.covers).toContain('/projects/{id}/board/{work}');
    for (const a of content.areas) expect(a.pages.length, a.name).toBeGreaterThan(0);
  });

  it('has every tutorial with who it is for', () => {
    const t = content.tutorials.find((x) => x.slug === 'try-xr-studio-in-a-trial-copy');
    expect(t?.title).toBe('Try XR Studio in a trial copy');
    expect(t?.for).toBe('Morgan, the director');
    expect(t?.id).toBe('tutorial-try-xr-studio-in-a-trial-copy');
  });
});

describe('links, images and raw HTML (help-tutorials-and-previews#AC-4)', () => {
  it('points links between pages at their help addresses', () => {
    const board = content.areas.find((a) => a.name === 'board');
    expect(board?.html).toContain('href="/help/board/board"');
    expect(board?.html).toContain('href="/help/review/review"');
    expect(content.start.html).toContain('href="/help/signing-in"');
  });

  it('shows the mock-up images, with their text alternatives', () => {
    const page = content.areas.find((a) => a.name === 'help')?.pages.find((p) => p.slug === 'help-and-tutorials');
    expect(page?.html).toMatch(/<img src="\/help-images\/design\/trying-the-product\/help-page\.png" alt="Help for a page"/);
    expect(content.images).toContain('design/trying-the-product/help-page.png');
  });

  it('shows raw HTML as text, never as markup', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'xr-help-'));
    mkdirSync(path.join(dir, 'docs/user/one'), { recursive: true });
    mkdirSync(path.join(dir, 'docs/tutorials'), { recursive: true });
    writeFileSync(path.join(dir, 'docs/user/README.md'), '---\nid: docs-start\nstatus: approved\n---\n\n# Start\n\n## The areas\n\n- [One](one/README.md): the one area.\n');
    writeFileSync(path.join(dir, 'docs/user/one/README.md'), '---\nid: docs-area-one\nstatus: approved\n---\n\n# One\n\n## Pages\n\n- [Page](page.md): a page.\n');
    writeFileSync(path.join(dir, 'docs/user/one/page.md'), '---\nid: docs-page\nstatus: approved\ncovers:\n  - /one\n---\n\n# Page\n\n<script>alert(1)</script>\n\nText with <b>bold</b>.\n');
    const c = generateHelp(dir);
    const html = c.areas[0]?.pages[0]?.html ?? '';
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('leaves out a page that is not approved', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'xr-help-'));
    mkdirSync(path.join(dir, 'docs/user/one'), { recursive: true });
    writeFileSync(path.join(dir, 'docs/user/README.md'), '---\nid: docs-start\nstatus: approved\n---\n\n# Start\n\n## The areas\n\n- [One](one/README.md): the one area.\n');
    writeFileSync(path.join(dir, 'docs/user/one/README.md'), '---\nid: docs-area-one\nstatus: approved\n---\n\n# One\n\n## Pages\n\n- [Page](page.md): a page.\n');
    writeFileSync(path.join(dir, 'docs/user/one/page.md'), '---\nid: docs-page\nstatus: draft\n---\n\n# Page\n');
    expect(generateHelp(dir).areas[0]?.pages).toEqual([]);
  });
});

describe('Help opens the help for the page you are on (help-tutorials-and-previews#AC-1)', () => {
  it('matches a covered address, a placeholder, and prefers a fixed segment', () => {
    expect(helpPathFor(content, '/projects')).toBe('/help/projects/your-projects');
    expect(helpPathFor(content, '/projects/abc/board')).toBe('/help/board/board');
    expect(helpPathFor(content, '/projects/abc/board/w1')).toBe('/help/board/versions-and-feedback');
    expect(helpPathFor(content, '/what-needs-you')).toBe('/help/what-needs-you/what-needs-you');
  });

  it('falls back to the area of the nearest covered address above, then to the start page', () => {
    expect(helpPathFor(content, '/projects/abc/no-such-tab')).toBe('/help/projects');
    expect(helpPathFor(content, '/nowhere/at/all')).toBe('/help');
    expect(helpPathFor(content, '/')).toBe('/help');
  });

  it('opens a page that exists for every address in decision-navigation-and-urls', () => {
    const decision = readFileSync(path.join(root, 'docs/design/decisions/navigation-and-urls.md'), 'utf8');
    const addresses = [...decision.matchAll(/^\|[^|]+\| `(\/[^`]*)` \|$/gm)].map((m) => (m[1] ?? '').replace(/<[^>]+>/g, 'x1').split('?')[0] ?? '');
    expect(addresses.length).toBeGreaterThan(30);
    const ok = served(content);
    for (const a of addresses) expect(ok.has(helpPathFor(content, a)), a).toBe(true);
  });
});

describe('the user documentation has no stray closing lines (help-tutorials-and-previews#AC-8)', () => {
  it('no page ends with </content> or </invoke>', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []));
    for (const file of walk(path.join(root, 'docs/user'))) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/^<\/(content|invoke)>\s*$/m);
    }
    expect(existsSync(path.join(root, 'docs/user/README.md'))).toBe(true);
  });
});
