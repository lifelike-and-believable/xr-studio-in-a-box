import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { areaNamed } from '@/help/content';
import { HelpText, Trail } from '../trail';

type Props = { params: Promise<{ area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: areaNamed((await params).area)?.title ?? 'This page is not available' };
}

// An area's overview (help-tutorials-and-previews#AC-2).
export default async function HelpArea({ params }: Props) {
  const area = areaNamed((await params).area);
  if (!area) notFound();
  return (
    <main id="main" className="help">
      <Trail steps={[{ label: 'Help', href: '/help' }, { label: area.title }]} />
      <h1>{area.title}</h1>
      <HelpText html={area.html} />
    </main>
  );
}
