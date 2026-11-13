'use client';
import Link from 'next/link';
import { useState } from 'react';

type Group = { organisation: string; projects: { id: string; name: string }[] };

// **Project: <name>** lists the person's projects grouped by organisation, then **All projects**
// (layer1-organisations-projects-people#AC-14).
export function ProjectSwitcher({ current, groups }: { current: string; groups: Group[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="menu">
      <button type="button" className="secondary" aria-expanded={open} aria-controls="project-switcher" onClick={() => setOpen(!open)}>
        Project: {current}
      </button>
      <div id="project-switcher" className="menu-panel" hidden={!open}>
        <nav aria-label="Your projects">
          {groups.map((g, i) => (
            <div key={g.organisation + i} role="group" aria-labelledby={`switcher-group-${i}`}>
              <p id={`switcher-group-${i}`} className="hint">
                {g.organisation}
              </p>
              <ul>
                {g.projects.map((p) => (
                  <li key={p.id}>
                    <Link href={`/projects/${p.id}`} onClick={() => setOpen(false)}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <hr />
          <Link href="/projects" onClick={() => setOpen(false)}>
            All projects
          </Link>
        </nav>
      </div>
    </div>
  );
}
