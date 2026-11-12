import Link from 'next/link';

// The same page and status whether the page does not exist or the person may not see it
// (layer1-organisations-projects-people#AC-16).
export const metadata = { title: 'This page is not available' };

export default function NotFound() {
  return (
    <main id="main">
      <h1>This page is not available</h1>
      <p>The page does not exist, or none of your roles lets you see it. If someone sent you the link, ask them to check you are on the project.</p>
      <p>
        <Link href="/">Go to your projects</Link>
      </p>
    </main>
  );
}
