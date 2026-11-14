import Link from 'next/link';
import type { ReactNode } from 'react';

// Help pages (design-trying-the-product, Layout): the product name, Back to XR Studio, and the
// page in one column. They hold no project data, so they open signed in or not.
export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site">
        <span className="home">XR Studio</span>
        <Link href="/">Back to XR Studio</Link>
      </header>
      {children}
    </>
  );
}
