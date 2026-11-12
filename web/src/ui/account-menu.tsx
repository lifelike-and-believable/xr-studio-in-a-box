'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { signOut } from './sign-out';

// The person's name opens Your account and Sign out (layer1-organisations-projects-people#AC-15).
export function AccountMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
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
