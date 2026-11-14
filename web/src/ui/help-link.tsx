'use client';
import { usePathname } from 'next/navigation';

// Help in the header, after the main navigation and before the person's name
// (help-tutorials-and-previews#AC-1). It names the page it was selected on.
export function HelpLink() {
  const path = usePathname();
  return <a href={`/help/for?path=${encodeURIComponent(path)}`}>Help</a>;
}
