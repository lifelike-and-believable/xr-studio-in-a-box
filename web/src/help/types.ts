// Help content, made at build time from docs/user/ and docs/tutorials/ (help-tutorials-and-previews).
export type HelpPage = { slug: string; title: string; covers: string[]; html: string };
export type HelpArea = { name: string; title: string; html: string; pages: HelpPage[] };
export type HelpTutorial = { slug: string; id: string; title: string; for: string; html: string };
export type HelpContent = {
  start: { title: string; html: string };
  areas: HelpArea[];
  tutorials: HelpTutorial[];
  images: string[];
};
