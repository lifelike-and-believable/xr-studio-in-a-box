'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// The "Not added" summary for a held file (layer1-facts-identifiers-activity#AC-25): it takes focus
// and leads the page title with "Error:".
export function HeldFileSummary({ heading, children }: { heading: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    document.title = `Error: ${heading} - ${document.title.replace(/^Error: [^-]+ - /, '')}`;
  }, [heading]);
  return (
    <div ref={ref} role="alert" tabIndex={-1} className="summary" aria-labelledby="held-file-title">
      <h2 id="held-file-title">{heading}</h2>
      {children}
    </div>
  );
}
