import type { Metadata } from 'next';
import { helpContent } from '@/help/content';
import { HelpText, Trail } from './trail';

export const metadata: Metadata = { title: 'Help' };

// The start page, then every tutorial (help-tutorials-and-previews#AC-2).
export default function HelpStart() {
  const content = helpContent();
  return (
    <main id="main" className="help">
      <Trail steps={[{ label: 'Help' }]} />
      <h1>{content.start.title}</h1>
      <HelpText html={content.start.html} />
      <h2 id="tutorials">Tutorials</h2>
      <ul>
        {content.tutorials.map((t) => (
          <li key={t.slug}>
            <a href={`/help/tutorials/${t.slug}`}>{t.title}</a>
            {t.for ? `, for ${t.for}` : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
