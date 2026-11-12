import Link from 'next/link';
import type { ReactNode } from 'react';
import { AccountMenu } from '@/ui/account-menu';
import { MainNav } from '@/ui/main-nav';
import { TimeZoneCookie } from '@/ui/time-zone';
import { currentPerson } from '@/ui/session';

// The frame every signed-in page sits in (design-dashboard-shell). Each page checks for a
// session itself, so it can return to the page it was asked for after sign-in.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const me = await currentPerson();
  return (
    <>
      <TimeZoneCookie />
      {me ? (
        <header className="site">
          <Link href="/" className="home">
            XR Studio
          </Link>
          <MainNav />
          <AccountMenu name={me.person.display} />
        </header>
      ) : null}
      {children}
    </>
  );
}
