'use client';
import { useEffect, useRef } from 'react';

export function FocusHeading({ id, children }: { id: string; children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <h2 id={id} ref={ref} tabIndex={-1}>
      {children}
    </h2>
  );
}
