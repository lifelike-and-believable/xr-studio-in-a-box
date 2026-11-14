// Makes Help from docs/user/ and docs/tutorials/ at build time (help-tutorials-and-previews#AC-2,
// AC-4). Run by web/scripts/help-content.mjs with Node's own type stripping, so it imports only
// Node and marked, and nothing the bundler would resolve. The areas come from the start page's
// links and each area's pages from its overview's "Pages" list, as rules-for-robots' docs-map does.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Marked, type Token } from 'marked';
import type { HelpArea, HelpContent, HelpPage, HelpTutorial } from './types';

const REPO = 'https://github.com/lifelike-and-believable/xr-studio-in-a-box/blob/main';
const IMAGE = /\.(png|jpe?g|gif|svg|webp)$/i;

type Doc = { front: string; body: string };

function read(file: string): Doc {
  const text = readFileSync(file, 'utf8');
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  return { front: m?.[1] ?? '', body: m ? text.slice(m[0].length) : text };
}

const field = (front: string, key: string) => new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(front)?.[1]?.trim() ?? null;
const listField = (front: string, key: string) =>
  [...(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, 'm').exec(front)?.[1] ?? '').matchAll(/^\s+-\s+(.+)$/gm)].map((m) => (m[1] ?? '').trim());
const titleOf = (body: string) => /^#\s+(.+)$/m.exec(body)?.[1]?.trim() ?? '';
const withoutTitle = (body: string) => body.replace(/^#\s+.+\r?\n/m, '');
const linksIn = (section: string) => [...section.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({ title: m[1] ?? '', href: m[2] ?? '' }));

function section(body: string, heading: string): string {
  const start = body.search(new RegExp(`^##\\s+${heading}\\s*$`, 'm'));
  if (start < 0) return '';
  const rest = body.slice(start).split(/\r?\n/).slice(1).join('\n');
  const end = rest.search(/^##\s/m);
  return end < 0 ? rest : rest.slice(0, end);
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function generateHelp(root: string): HelpContent {
  const docs = path.join(root, 'docs');
  const images = new Set<string>();

  // Where a link in a file goes in Help: another page, a tutorial, an image, or the repository.
  const resolve = (from: string, href: string): string => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('/')) return href;
    const [target = '', anchor] = href.split('#');
    const abs = path.resolve(path.dirname(from), target);
    const rel = path.relative(docs, abs).split(path.sep).join('/');
    const hash = anchor ? `#${anchor}` : '';
    if (rel.startsWith('..')) return `${REPO}/${path.relative(root, abs).split(path.sep).join('/')}`;
    if (IMAGE.test(rel)) {
      images.add(rel);
      return `/help-images/${rel}`;
    }
    const user = /^user\/(?:([^/]+)\/)?([^/]+)\.md$/.exec(rel);
    if (user) {
      const [, area, page] = user;
      if (!area) return page === 'README' ? `/help${hash}` : `${REPO}/docs/${rel}`;
      return page === 'README' ? `/help/${area}${hash}` : `/help/${area}/${page}${hash}`;
    }
    const tutorial = /^tutorials\/([^/]+)\.md$/.exec(rel);
    if (tutorial) return `/help/tutorials/${tutorial[1]}${hash}`;
    return `${REPO}/docs/${rel}`;
  };

  // Raw HTML is shown as text, never run; comments are notes for authors and are left out.
  const render = (file: string, body: string) => {
    const marked = new Marked({
      renderer: { html: ({ text }) => escapeHtml(text) },
      walkTokens: (token: Token) => {
        if (token.type === 'link' || token.type === 'image') token.href = resolve(file, token.href);
      },
    });
    return marked.parse(withoutTitle(body).replace(/<!--[\s\S]*?-->\s*/g, ''), { async: false }) as string;
  };

  const startFile = path.join(docs, 'user/README.md');
  const start = read(startFile);
  const areas: HelpArea[] = [];
  for (const link of linksIn(section(start.body, 'The areas'))) {
    const file = path.resolve(path.dirname(startFile), link.href);
    if (!existsSync(file)) continue;
    const name = path.basename(path.dirname(file));
    const overview = read(file);
    const pages: HelpPage[] = [];
    for (const p of linksIn(section(overview.body, 'Pages'))) {
      const pageFile = path.resolve(path.dirname(file), p.href);
      if (!existsSync(pageFile)) continue;
      const doc = read(pageFile);
      if (field(doc.front, 'status') !== 'approved') continue;
      pages.push({ slug: path.basename(pageFile, '.md'), title: titleOf(doc.body), covers: listField(doc.front, 'covers'), html: render(pageFile, doc.body) });
    }
    areas.push({ name, title: titleOf(overview.body), html: render(file, overview.body), pages });
  }

  const tutorialsDir = path.join(docs, 'tutorials');
  const tutorials: HelpTutorial[] = [];
  for (const name of existsSync(tutorialsDir) ? readdirSync(tutorialsDir).filter((f) => f.endsWith('.md')).sort() : []) {
    const file = path.join(tutorialsDir, name);
    const doc = read(file);
    const id = field(doc.front, 'id');
    if (!id) continue;
    tutorials.push({
      slug: name.replace(/\.md$/, ''),
      id,
      title: titleOf(doc.body),
      for: /^For \*\*(.+?)\*\*\.?\s*$/m.exec(doc.body)?.[1] ?? '',
      html: render(file, doc.body),
    });
  }

  return { start: { title: titleOf(start.body), html: render(startFile, start.body) }, areas, tutorials, images: [...images].sort() };
}

// Writes the content for the app to read (web/.help/content.json) and copies the images it shows
// into web/public/help-images/. Both are made again at each build, and git ignores them.
export function writeHelp(root: string, web: string): HelpContent {
  const content = generateHelp(root);
  mkdirSync(path.join(web, '.help'), { recursive: true });
  writeFileSync(path.join(web, '.help/content.json'), JSON.stringify(content));
  const publicDir = path.join(web, 'public/help-images');
  rmSync(publicDir, { recursive: true, force: true });
  for (const image of content.images) {
    const to = path.join(publicDir, image);
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(path.join(root, 'docs', image), to);
  }
  return content;
}
