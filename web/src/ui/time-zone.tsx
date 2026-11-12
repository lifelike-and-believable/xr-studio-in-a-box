'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Sends the browser's time zone with each request, so times are shown in it
// (layer1-facts-identifiers-activity#AC-36). The first page after a change is drawn again.
export function TimeZoneCookie() {
  const router = useRouter();
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const current = document.cookie.split('; ').find((c) => c.startsWith('tz='))?.slice(3);
    if (!zone || decodeURIComponent(current ?? '') === zone) return;
    document.cookie = `tz=${encodeURIComponent(zone)}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);
  return null;
}
