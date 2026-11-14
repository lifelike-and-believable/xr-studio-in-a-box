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
  {
    id: 'tutorial-start-a-production-and-bring-in-your-team',
    title: 'Start a production and bring in your team',
    file: 'docs/tutorials/start-a-production-and-bring-in-your-team.md',
    for: 'Jordan, the producer',
    startsWith: 'A new installation where Jordan can sign in',
    firstPerson: 'Jordan',
  },
  {
    id: 'tutorial-sign-in-and-add-a-passkey',
    title: 'Sign in and add a passkey',
    file: 'docs/tutorials/sign-in-and-add-a-passkey.md',
    for: 'Riley, the artist',
    startsWith: 'The Lantern Keeper with its team',
    firstPerson: 'Riley',
  },
  {
    id: 'tutorial-record-a-projects-facts',
    title: 'Record a project\'s facts',
    file: 'docs/tutorials/record-a-projects-facts.md',
    for: 'Jordan, the producer',
    startsWith: 'The Lantern Keeper with its team',
    firstPerson: 'Jordan',
  },
  {
    id: 'tutorial-keep-your-organisations-facts',
    title: 'Keep your organisation\'s facts',
    file: 'docs/tutorials/keep-your-organisations-facts.md',
    for: 'Jordan, the producer',
    startsWith: 'The Lantern Keeper with its team',
    firstPerson: 'Jordan',
  },
  {
    id: 'tutorial-keep-bank-details-and-tax-numbers-out',
    title: 'Keep bank details and tax numbers out',
    file: 'docs/tutorials/keep-bank-details-and-tax-numbers-out.md',
    for: 'Jordan, the producer',
    startsWith: 'The Lantern Keeper with its team',
    firstPerson: 'Jordan',
  },
  {
    id: 'tutorial-name-who-approves-what',
    title: 'Name who approves what',
    file: 'docs/tutorials/name-who-approves-what.md',
    for: 'Jordan, the producer',
    startsWith: 'The Lantern Keeper with its team',
    firstPerson: 'Jordan',
  },
  {
    id: 'tutorial-send-work-for-review',
    title: 'Send work for review',
    file: 'docs/tutorials/send-work-for-review.md',
    for: 'Riley, the artist',
    startsWith: 'The Lantern Keeper with its approvers named',
    firstPerson: 'Riley',
  },
  {
    id: 'tutorial-clear-your-review-queue',
    title: 'Clear your review queue',
    file: 'docs/tutorials/clear-your-review-queue.md',
    for: 'Morgan, the director',
    startsWith: 'Six items Riley has sent for review',
    firstPerson: 'Morgan',
  },
  {
    id: 'tutorial-see-where-everything-stands',
    title: 'See where everything stands',
    file: 'docs/tutorials/see-where-everything-stands.md',
    for: 'Jordan, the producer',
    startsWith: 'The Lantern Keeper with its approvers named',
    firstPerson: 'Jordan',
  },
  {
    id: 'tutorial-give-feedback-and-compare-versions',
    title: 'Give feedback and compare versions',
    file: 'docs/tutorials/give-feedback-and-compare-versions.md',
    for: 'Riley, the artist',
    startsWith: 'Work on the board, and a revision asked for',
    firstPerson: 'Riley',
  },
  {
    id: 'tutorial-find-what-needs-you',
    title: 'Find what needs you',
    file: 'docs/tutorials/find-what-needs-you.md',
    for: 'Drew, the sound designer',
    startsWith: 'Work on the board, and a revision asked for',
    firstPerson: 'Drew',
  },
  {
    id: 'tutorial-read-who-changed-what',
    title: 'Read who changed what',
    file: 'docs/tutorials/read-who-changed-what.md',
    for: 'Jordan, the producer',
    startsWith: 'A character sheet accepted at its third version',
    firstPerson: 'Jordan',
  },
];

export function tutorialById(id: string): TrialTutorial | undefined {
  return TUTORIALS.find((t) => t.id === id);
}

// A tutorial in Help (help-tutorials-and-previews#AC-7).
export function tutorialLink(t: TrialTutorial): string {
  return `/help/tutorials/${t.file.replace(/^docs\/tutorials\//, '').replace(/\.md$/, '')}`;
}

// Where Try XR Studio puts the Start dialog: above the table, so the dialog's Start comes before
// every row's Start in the page (the tutorial runner clicks the first one it finds).
export const DIALOGS = 'try-dialogs';

// The made-up files the tutorials choose, offered on Try XR Studio (help-tutorials-and-previews#AC-12).
export type TryFile = { name: string; about: string };
export const TRY_FILES: readonly TryFile[] = [
  { name: 'character-sheet.png', about: 'A character sheet, for Send work for review and the versions tutorials' },
  { name: 'harbour-lighting.png', about: 'A lighting pass, for Send work for review' },
  { name: 'lighthouse-concept.png', about: 'Concept art, for Send work for review' },
  { name: 'bell-sounds.png', about: 'Bell sounds, for Send work for review' },
  { name: 'harbour-recordings-licence.pdf', about: 'A licence, for Send work for review' },
  { name: 'lantern-test.png', about: "A work sample, for Record a project's facts" },
  { name: 'grant-letter.pdf', about: 'A letter with a made-up GST/HST number, for Keep bank details and tax numbers out' },
];
