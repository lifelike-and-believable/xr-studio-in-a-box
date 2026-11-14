import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { areaNamed, pageIn, tutorialNamed } from '@/help/content';
import { tryMode } from '@/try/mode';
import { HelpText, Trail } from '../../trail';

type Props = { params: Promise<{ area: string; page: string }> };

function find(area: string, page: string) {
  if (area === 'tutorials') {
    const tutorial = tutorialNamed(page);
    return tutorial ? { kind: 'tutorial' as const, tutorial } : null;
  }
  const a = areaNamed(area);
  const p = a ? pageIn(a, page) : undefined;
  return a && p ? { kind: 'page' as const, area: a, page: p } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area, page } = await params;
  const found = find(area, page);
  return { title: found ? (found.kind === 'tutorial' ? found.tutorial.title : found.page.title) : 'This page is not available' };
}

// A page of an area, or a tutorial (help-tutorials-and-previews#AC-2, AC-3, AC-6).
export default async function HelpPage({ params }: Props) {
  const { area, page } = await params;
  const found = find(area, page);
  if (!found) notFound();
  if (found.kind === 'tutorial') {
    const { tutorial } = found;
    // In a trial copy, the notice goes above the steps, after "For ...".
    const at = tutorial.html.indexOf('<h2');
    const [before, after] = at < 0 ? [tutorial.html, ''] : [tutorial.html.slice(0, at), tutorial.html.slice(at)];
    return (
      <main id="main" className="help">
        <Trail steps={[{ label: 'Help', href: '/help' }, { label: 'Tutorials', href: '/help#tutorials' }, { label: tutorial.title }]} />
        <h1>{tutorial.title}</h1>
        <HelpText html={before} />
        {tryMode() ? (
          <div className="notice">
            <p>
              You are in a trial copy. To put it at this tutorial&apos;s starting point, select Start beside it on <a href="/try">Try XR Studio</a>.
            </p>
          </div>
        ) : null}
        <HelpText html={after} />
      </main>
    );
  }
  const { area: a, page: p } = found;
  return (
    <main id="main" className="help">
      <Trail steps={[{ label: 'Help', href: '/help' }, { label: a.title, href: `/help/${a.name}` }, { label: p.title }]} />
      <h1>{p.title}</h1>
      <HelpText html={p.html} />
      <h2>In this part of Help</h2>
      <ul>
        {a.pages.map((x) => (
          <li key={x.slug}>
            {x.slug === p.slug ? (
              <>
                {x.title} (this page)
              </>
            ) : (
              <a href={`/help/${a.name}/${x.slug}`}>{x.title}</a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
