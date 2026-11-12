'use client';
import { useEffect, useRef } from 'react';

// A notice after a successful action: focus moves to it, and the page title leads with the
// outcome (layer1-organisations-projects-people#AC-38).
export function Notice({ children, title }: { children: string; title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const lead = title ?? children;
    if (!document.title.startsWith(lead)) document.title = `${lead} - ${document.title}`;
  }, [children, title]);
  return (
    <div ref={ref} role="status" tabIndex={-1} className="notice">
      {children}
    </div>
  );
}
