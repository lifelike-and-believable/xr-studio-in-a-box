import type { FeedbackEntry } from '@/record/work';
import { entryTime } from './time';
import { decisionTag } from './work-view';

// **Feedback on version <n>**: an ordered list, oldest first, each entry starting with who and
// when; decision feedback carries its decision as a text tag (layer1-versions-board-first-view#AC-19).
export function FeedbackThread({ version, entries, zone }: { version: number; entries: FeedbackEntry[]; zone: string }) {
  return (
    <>
      <h3 id={`feedback-${version}`}>Feedback on version {version}</h3>
      {entries.length === 0 ? (
        <p>No feedback on version {version} yet.</p>
      ) : (
        <ol className="thread">
          {entries.map((e, i) => (
            <li key={i}>
              <p className="who">
                {e.by}, {entryTime(e.at, zone)}
                {e.decision ? <span className="tag">{decisionTag(e.decision)}</span> : null}
              </p>
              <p className="said">{e.text}</p>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
