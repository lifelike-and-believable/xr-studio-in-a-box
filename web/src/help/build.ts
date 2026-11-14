import type { HelpContent } from './types';

export function generateHelp(root: string): HelpContent {
  void root;
  return { start: { title: 'stub', html: '' }, areas: [], tutorials: [], images: [] };
}
