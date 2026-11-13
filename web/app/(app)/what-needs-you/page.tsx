import type { Metadata } from 'next';
import { projectsFor } from '@/record/queries';
import { whatNeedsYou } from '@/record/work';
import { ProjectsList } from '@/ui/projects-list';
import { requirePerson } from '@/ui/session';
import { viewerZone } from '@/ui/time';
import { needsView } from '@/ui/work-view';
import { NeedsLive } from './needs-live';

export const metadata: Metadata = { title: 'What needs you' };

// **What needs you**, the first view after sign-in (layer1-versions-board-first-view#AC-32 to
// AC-39). It adds no record of its own: everything here is read from the queue and the board.
export default async function WhatNeedsYou() {
  const me = await requirePerson('/what-needs-you');
  if ((await projectsFor(me.person.id)).length === 0) return <ProjectsList personId={me.person.id} heading="You are not on any projects" />;
  const view = needsView(await whatNeedsYou(me.person.id), await viewerZone(), me.person.id);
  return (
    <main id="main">
      <h1>What needs you</h1>
      <p className="lead">What is waiting for you on all your projects, grouped by gate, oldest first. It updates as work moves; there is no need to reload.</p>
      <NeedsLive initial={view} />
    </main>
  );
}
