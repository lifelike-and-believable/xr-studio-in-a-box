'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Overview, Review, Facts, People, Approvers and, for roles that may read it, Activity
// (layer1-facts-identifiers-activity#AC-1, AC-34; layer1-gates-and-queue#AC-2).
export function ProjectTabs({ id, activity }: { id: string; activity: boolean }) {
  const path = usePathname();
  const tabs = [
    { href: `/projects/${id}`, label: 'Overview' },
    { href: `/projects/${id}/review`, label: 'Review' },
    { href: `/projects/${id}/facts`, label: 'Facts' },
    { href: `/projects/${id}/people`, label: 'People' },
    { href: `/projects/${id}/approvers`, label: 'Approvers' },
    ...(activity ? [{ href: `/projects/${id}/activity`, label: 'Activity' }] : []),
  ];
  const current = tabs.slice(1).find((t) => path.startsWith(t.href))?.href ?? tabs[0]?.href;
  return (
    <nav aria-label="Project">
      <ul>
        {tabs.map((t) => (
          <li key={t.href}>
            <Link href={t.href} aria-current={t.href === current ? 'page' : undefined}>
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
