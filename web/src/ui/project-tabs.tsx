'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ProjectTabs({ id }: { id: string }) {
  const path = usePathname();
  const people = path.startsWith(`/projects/${id}/people`);
  return (
    <nav aria-label="Project">
      <ul>
        <li>
          <Link href={`/projects/${id}`} aria-current={!people ? 'page' : undefined}>
            Overview
          </Link>
        </li>
        <li>
          <Link href={`/projects/${id}/people`} aria-current={people ? 'page' : undefined}>
            People
          </Link>
        </li>
      </ul>
    </nav>
  );
}
