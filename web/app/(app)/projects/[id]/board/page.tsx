import type { Metadata } from 'next';
import Link from 'next/link';
import { decidersFor } from '@/record/review';
import { Notice } from '@/ui/notice';
import { openProject } from '@/ui/project-access';
import { viewerZone } from '@/ui/time';
import { boardData } from '@/ui/work-view';
import { BoardLive } from './board-live';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ show?: string; notice?: string; title?: string }> };

export const metadata: Metadata = { title: 'Board' };

// **Board** (layer1-versions-board-first-view#AC-5 to AC-12): every stage and piece of work with
// its owner and state, drawn on the server and then kept up to date in the browser.
export default async function Board({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const { view } = await openProject(id, `/projects/${id}/board`);
  if (view.state !== 'open') return null;
  const blocked = search.show === 'blocked';
  const data = await boardData(id, await viewerZone(), await decidersFor(id));
  return (
    <>
      {search.notice === 'removed' && search.title ? <Notice title="Removed">{`Removed ${search.title} from the board.`}</Notice> : null}
      <p className="lead">Every stage and piece of work on this project, with its owner and its state. States change by themselves as work is sent, decided and handed on.</p>
      {view.can.has('plan-work') ? (
        <div className="actions">
          <Link href={`/projects/${id}/board/new`} className="button">
            Add work
          </Link>
        </div>
      ) : null}
      <nav aria-label="Show" className="switch">
        <ul>
          <li>
            <Link href={`/projects/${id}/board`} aria-current={blocked ? undefined : 'page'}>
              All work
            </Link>
          </li>
          <li>
            <Link href={`/projects/${id}/board?show=blocked`} aria-current={blocked ? 'page' : undefined}>
              Blocked work only
            </Link>
          </li>
        </ul>
      </nav>
      <BoardLive projectId={id} initial={data} blockedOnly={blocked} />
    </>
  );
}
