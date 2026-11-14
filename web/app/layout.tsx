import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TrialLine } from '@/ui/trial-line';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'XR Studio', template: '%s - XR Studio' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <TrialLine />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
