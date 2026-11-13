'use client';
import { useEffect, useRef } from 'react';

// "Choose two different versions." next to the choices, taking focus (AC-29).
export function CompareError() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    ref.current?.focus();
    document.title = `Error: ${document.title.replace(/^Error: /, '')}`;
  }, []);
  return (
    <p ref={ref} id="compare-error" role="alert" tabIndex={-1} className="field-error">
      <span className="visually-hidden">Error: </span>Choose two different versions.
    </p>
  );
}
