'use server';
import { notFound, redirect } from 'next/navigation';
import { tryMode } from '@/try/mode';
import { isMarked, loadStartingPoint } from '@/try/records';
import { tutorialById } from '@/try/starting-points';

// Start (trying-the-product#AC-10). Try mode is asked before anything is read from the request.
export async function startTutorial(form: FormData): Promise<void> {
  if (!tryMode()) notFound();
  const tutorial = tutorialById(String(form.get('tutorial') ?? ''));
  if (!tutorial || !(await isMarked())) notFound();
  await loadStartingPoint(tutorial.id);
  redirect(`/try?started=${encodeURIComponent(tutorial.id)}`);
}
