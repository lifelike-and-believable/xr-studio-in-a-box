import Link from 'next/link';
import type { ReactNode } from 'react';

// The pages of a trial copy have the product name and no project navigation
// (design-trying-the-product, Layout).
export default function TryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site">
        <Link href="/" className="home">
          XR Studio
        </Link>
      </header>
      {children}
    </>
  );
}
