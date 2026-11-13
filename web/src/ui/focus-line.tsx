'use client';
import { useEffect, useRef } from 'react';

// A result line that takes focus after the page loads and leads the page title, as after
// **Apply filters** (layer1-gates-and-queue#AC-23).
export function FocusLine({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    ref.current?.focus();
    if (!document.title.startsWith(children)) document.title = `${children} - ${document.title}`;
  }, [children]);
  return (
    <p ref={ref} tabIndex={-1}>
      {children}
    </p>
  );
}
