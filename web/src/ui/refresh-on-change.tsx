'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { nowTime, useUpdates } from './use-updates';

// Keeps a server-drawn page up to date: when the record's stamp changes, the page is drawn again
// in place, with no reload and no move of focus (layer1-versions-board-first-view#AC-11).
export function RefreshOnChange({ url, stamp }: { url: string; stamp: string }) {
  const router = useRouter();
  const seen = useRef(stamp);
  const [status, setStatus] = useState('');
  useUpdates(
    () => url,
    (data) => {
      const next = (data as { stamp?: string }).stamp ?? '';
      if (next === seen.current) return;
      seen.current = next;
      setStatus(`Updated ${nowTime(new Date())}.`);
      router.refresh();
    },
    (at) => setStatus(`Could not check for updates at ${nowTime(at)}. Trying again in a minute. This page may be out of date; reload it to check now.`),
  );
  return (
    <p role="status" aria-live="polite" data-updates="" className="updates">
      {status}
    </p>
  );
}
