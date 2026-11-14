import { tryMode } from '../try/mode';

// The trial line (design-trying-the-product, Layout): first in every page of a trial copy, plain
// text with a link, not a live region, so a screen reader reads it once (trying-the-product#AC-6).
export function TrialLine() {
  if (!tryMode()) return null;
  return (
    <div className="trial-line">
      Trial copy. The people, projects and files here are made up. Do not enter real information. <a href="/try">Try XR Studio</a>
    </div>
  );
}
