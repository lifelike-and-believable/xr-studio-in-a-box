import Link from 'next/link';

// A help address that does not exist (help-tutorials-and-previews#AC-5): the same page as
// elsewhere, with Back to XR Studio in place of the link to projects.
export const metadata = { title: 'This page is not available' };

export default function HelpNotFound() {
  return (
    <main id="main">
      <h1>This page is not available</h1>
      <p>The page was moved or renamed.</p>
      <p>
        <Link href="/">Back to XR Studio</Link>
      </p>
    </main>
  );
}
