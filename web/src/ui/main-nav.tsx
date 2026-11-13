'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// What needs you, Projects and Organisations (layer1-versions-board-first-view#AC-32). On their own
// pages the link is the current page; inside a project, Projects is the current section
// (design-dashboard-shell).
export function MainNav() {
  const path = usePathname();
  const needs = path === '/what-needs-you' ? 'page' : undefined;
  const projects = path === '/projects' || path === '/' ? 'page' : path.startsWith('/projects') ? 'true' : undefined;
  const organisations = path === '/organisations' ? 'page' : path.startsWith('/organisations') ? 'true' : undefined;
  return (
    <nav aria-label="Main">
      <ul>
        <li>
          <Link href="/what-needs-you" aria-current={needs}>
            What needs you
          </Link>
        </li>
        <li>
          <Link href="/projects" aria-current={projects}>
            Projects
          </Link>
        </li>
        <li>
          <Link href="/organisations" aria-current={organisations}>
            Organisations
          </Link>
        </li>
      </ul>
    </nav>
  );
}
