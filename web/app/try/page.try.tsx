import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Notice } from '@/ui/notice';
import { currentPerson } from '@/ui/session';
import { tryMode } from '@/try/mode';
import { PEOPLE } from '@/try/people';
import { whoCanSignIn } from '@/try/sign-in';
import { TUTORIALS, tutorialById, tutorialLink } from '@/try/starting-points';
import { StartDialog } from './start-dialog';

type Props = { searchParams: Promise<{ started?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const started = tutorialById((await searchParams).started ?? '');
  return { title: started ? `Started ${started.title}` : 'Try XR Studio' };
}

// Try XR Studio (trying-the-product#AC-7 to AC-11, AC-17). Exists only in a try build, and answers
// 404 there too unless try mode is on.
export default async function TryPage({ searchParams }: Props) {
  if (!tryMode()) notFound();
  const started = tutorialById((await searchParams).started ?? '');
  const me = await currentPerson();
  const can = await whoCanSignIn();
  return (
    <main id="main">
      <h1>Try XR Studio</h1>
      {started ? (
        <>
          <Notice title={`Started ${started.title}`}>
            {`This copy now holds the starting point for ${started.title}: ${started.startsWith}. Sign in as ${started.firstPerson} to begin.`}
          </Notice>
          <p>
            <a href={tutorialLink(started)}>Open the tutorial</a>
          </p>
        </>
      ) : null}

      <h2>Choose a tutorial</h2>
      <table>
        <caption className="visually-hidden">Tutorials you can start in this trial copy</caption>
        <thead>
          <tr>
            <th scope="col">Tutorial</th>
            <th scope="col">For</th>
            <th scope="col">Starts with</th>
            <th scope="col">Start</th>
          </tr>
        </thead>
        <tbody>
          {TUTORIALS.map((t) => (
            <tr key={t.id}>
              <td data-label="Tutorial">
                <a href={tutorialLink(t)}>{t.title}</a>
              </td>
              <td data-label="For">{t.for}</td>
              <td data-label="Starts with">{t.startsWith}</td>
              <td>
                <StartDialog id={t.id} title={t.title} startsWith={t.startsWith} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Sign in as a person</h2>
      <p>{me ? `Signed in as ${me.person.display}.` : 'Nobody is signed in in this browser.'}</p>
      <ul className="try-people">
        {PEOPLE.map((p) => (
          <li key={p.first}>
            <span className="who">
              <span>{p.name}</span>
              <span>{p.role}</span>
            </span>
            {can.get(p.first) ? (
              // A plain link, which the browser does not fetch ahead (trying-the-product#AC-14).
              <a className="button" href={`/try/sign-in?as=${p.first}`}>
                Sign in as {p.first}
              </a>
            ) : (
              <span>
                Not added yet. Jordan adds {p.first} in the tutorial.
              </span>
            )}
          </li>
        ))}
      </ul>
      <p>To act as two people at once, open a private window for the second person.</p>

      <h2>Email</h2>
      <p>
        <a href="/try/mail">Email sent by this copy</a>
      </p>
      <p>No email leaves a trial copy.</p>
    </main>
  );
}
