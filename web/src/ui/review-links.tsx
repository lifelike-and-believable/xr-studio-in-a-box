import Link from 'next/link';

// The links at the top of every review page (layer1-gates-and-queue#AC-13).
export function ReviewLinks({ id, current }: { id: string; current?: 'sent' | 'waiting' }) {
  return (
    <div className="subnav">
      <Link href={`/projects/${id}/review/new`} className="button">
        Send for review
      </Link>
      <Link href={`/projects/${id}/review/sent`} aria-current={current === 'sent' ? 'page' : undefined}>
        Sent by you
      </Link>
      <Link href={`/projects/${id}/review/waiting`} aria-current={current === 'waiting' ? 'page' : undefined}>
        Everything waiting
      </Link>
    </div>
  );
}
