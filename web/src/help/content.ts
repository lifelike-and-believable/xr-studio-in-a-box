import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { HelpArea, HelpContent, HelpPage, HelpTutorial } from './types';

let cached: HelpContent | undefined;

// Made by web/scripts/help-content.mjs at each build, so a deployment's help matches its pages.
export function helpContent(): HelpContent {
  cached ??= JSON.parse(readFileSync(path.join(process.cwd(), '.help/content.json'), 'utf8')) as HelpContent;
  return cached;
}

export const areaNamed = (name: string): HelpArea | undefined => helpContent().areas.find((a) => a.name === name);
export const pageIn = (area: HelpArea, slug: string): HelpPage | undefined => area.pages.find((p) => p.slug === slug);
export const tutorialNamed = (slug: string): HelpTutorial | undefined => helpContent().tutorials.find((t) => t.slug === slug);
