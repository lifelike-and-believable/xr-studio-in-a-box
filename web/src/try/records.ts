import 'server-only';

// app_meta's key for the trial-copy mark (trying-the-product#AC-4).
export const TRIAL_MARK = 'trial-copy';

// XR Studio's own tables, emptied by name (trying-the-product#AC-15). app_meta keeps the mark.
export const APP_TABLES: readonly string[] = [];

export async function isMarked(): Promise<boolean> {
  return true;
}

export async function markTrialCopy(): Promise<void> {}

export async function loadStartingPoint(tutorialId: string): Promise<void> {
  void tutorialId;
}
