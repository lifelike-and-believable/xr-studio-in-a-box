// The tutorials Try XR Studio offers, in order, each with the starting point Start loads. Kept in
// code because a deployed function cannot rely on docs/ being beside it; a unit test checks the
// list against docs/tutorials/ (trying-the-product#AC-8).
export type TrialTutorial = {
  id: string;
  title: string;
  file: string;
  for: string;
  startsWith: string;
  firstPerson: string;
};

export const TUTORIALS: readonly TrialTutorial[] = [
  {
    id: 'tutorial-try-xr-studio-in-a-trial-copy',
    title: 'Try XR Studio in a trial copy',
    file: 'docs/tutorials/try-xr-studio-in-a-trial-copy.md',
    for: 'Morgan, the director',
    startsWith: 'A new installation where Jordan can sign in',
    firstPerson: 'Jordan',
  },
];

export function tutorialById(id: string): TrialTutorial | undefined {
  return TUTORIALS.find((t) => t.id === id);
}

// Until Help is built (design-trying-the-product, delivery step 6), a title links to the file.
export function tutorialLink(t: TrialTutorial): string {
  return `https://github.com/lifelike-and-believable/xr-studio-in-a-box/blob/main/${t.file}`;
}

// Where Try XR Studio puts the Start dialog: above the table, so the dialog's Start comes before
// every row's Start in the page (the tutorial runner clicks the first one it finds).
export const DIALOGS = 'try-dialogs';
