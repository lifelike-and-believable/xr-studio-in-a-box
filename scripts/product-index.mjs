#!/usr/bin/env node
// Builds docs/product/README.md: every epic and story, grouped by layer.
// Run from the repository root after adding or changing epics or stories:
//   node scripts/product-index.mjs
import fs from 'node:fs';
import path from 'node:path';

const EPICS = 'docs/product/epics';
const STORIES = 'docs/product/stories';
const OUT = 'docs/product/README.md';

const section = (text, name) => {
  const match = text.match(new RegExp(`^## ${name}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return match ? match[1] : '';
};
const bullets = text => text.split(/\r?\n/).filter(l => l.startsWith('- ')).map(l => l.slice(2));
const field = (text, name) => (text.match(new RegExp(`^${name}: *(.+)$`, 'm')) || [])[1]?.trim() ?? '';
const heading = text => (text.match(/^# (.+)$/m) || [])[1]?.trim() ?? '';

function writtenStories(epic) {
  const dir = path.join(STORIES, epic);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    return { file: `stories/${epic}/${f}`, title: heading(text), status: field(text, 'status') };
  });
}

const layers = new Map();
for (const file of fs.readdirSync(EPICS).filter(f => f.endsWith('.md')).sort()) {
  const text = fs.readFileSync(path.join(EPICS, file), 'utf8');
  const layer = (text.match(/<!-- (.+?)\.? -->/) || [])[1] ?? 'No layer';
  const epic = file.replace(/\.md$/, '');
  const open = bullets(section(text, 'Open questions')).filter(q => !q.startsWith('Answered:')).length;
  const entry = { epic, title: heading(text), status: field(text, 'status'), open,
    proposed: bullets(section(text, 'Proposed stories')), written: writtenStories(epic) };
  layers.set(layer, [...(layers.get(layer) ?? []), entry]);
}

const order = name => { const n = name.match(/^Layer (\d+)/); return n ? Number(n[1]) : 99; };
const sorted = [...layers.entries()].sort((a, b) => order(a[0]) - order(b[0]));
const all = sorted.flatMap(([, epics]) => epics);
const count = f => all.reduce((sum, e) => sum + f(e), 0);

const lines = [
  '# Product map',
  '',
  'Every epic and story, grouped by layer. This page is generated, so change the epics or stories and run `node scripts/product-index.mjs`.',
  '',
  `${all.length} epics, ${count(e => e.proposed.length)} proposed stories, ${count(e => e.written.length)} written, ${count(e => e.open)} open questions.`,
  '',
  '- [Concept](concept.md)',
  '- [Requirements](requirements/)',
  '- [Personas](personas/)',
  '- [Show scenarios](discovery/show-scenarios.md)',
  '',
];

for (const [layer, epics] of sorted) {
  lines.push(`## ${layer}`, '', '| Epic | Stories written | Open questions |', '|---|---|---|');
  for (const e of epics) lines.push(`| [${e.title}](epics/${e.epic}.md) | ${e.written.length} of ${e.proposed.length} | ${e.open} |`);
  lines.push('');
  for (const e of epics) {
    lines.push('<details>', `<summary>${e.title}</summary>`, '');
    if (e.written.length) {
      lines.push(...e.written.map(s => `- [${s.title}](${s.file}) (${s.status})`), '');
    }
    lines.push(...e.proposed.map(s => `- ${s}`), '', '</details>', '');
  }
}

fs.writeFileSync(OUT, `${lines.join('\n').trimEnd()}\n`);
console.log(`${OUT}: ${all.length} epics, ${count(e => e.proposed.length)} proposed stories`);
