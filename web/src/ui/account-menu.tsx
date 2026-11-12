'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { signOut } from './sign-out';

// The person's name opens Your account and Sign out (layer1-organisations-projects-people#AC-15).
export function AccountMenu({ name }: { name: string }) {
  // The menu sits in the frame every page shares, so it is open only on the page it was opened
  // on: a page change closes it.
  const path = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const setOpen = (value: boolean) => setOpenOn(value ? path : null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null);
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <div className="menu">
      <button type="button" className="secondary" aria-expanded={open} aria-controls="account-menu" onClick={() => setOpen(!open)}>
        {name}
      </button>
      <div id="account-menu" ref={panel} className="menu-panel" hidden={!open}>
        <nav aria-label="Account">
          <ul>
            <li>
              <Link href="/account">Your account</Link>
            </li>
            <li>
              <form action={signOut}>
                <button type="submit" className="link">
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
