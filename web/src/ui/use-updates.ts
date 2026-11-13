'use client';
import { useEffect, useRef } from 'react';

const EVERY = 15_000;
const AFTER_FAILURE = 60_000;

// Asks for changes every 15 seconds while the page is visible, and at once when it becomes visible
// again; after a failure, the next try is a minute later (design-work-and-versions choice 11).
// Polling suits Vercel functions, which do not hold connections open.
export function useUpdates(url: () => string, onData: (data: unknown) => void, onFailure: (at: Date) => void) {
  const latest = useRef({ url, onData, onFailure });
  useEffect(() => {
    latest.current = { url, onData, onFailure };
  });
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let busy = false;
    const schedule = (ms: number) => {
      clearTimeout(timer);
      if (document.visibilityState === 'visible') timer = setTimeout(check, ms);
    };
    async function check() {
      if (busy) return;
      busy = true;
      try {
        const response = await fetch(latest.current.url(), { cache: 'no-store' });
        if (!response.ok) throw new Error(String(response.status));
        latest.current.onData(await response.json());
        schedule(EVERY);
      } catch {
        latest.current.onFailure(new Date());
        schedule(AFTER_FAILURE);
      } finally {
        busy = false;
      }
    }
    const visible = () => {
      if (document.visibilityState === 'visible') void check();
      else clearTimeout(timer);
    };
    document.addEventListener('visibilitychange', visible);
    schedule(EVERY);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', visible);
    };
  }, []);
}

// "14:22", in the viewer's own time.
export const nowTime = (at: Date) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(at);
