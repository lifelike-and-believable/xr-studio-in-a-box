import type { Env } from './mode';

export type PreviewBuild = 'skipped' | 'prepared';

export async function preparePreviewDatabase(env: Env, migrationsFolder: string): Promise<PreviewBuild> {
  void env;
  void migrationsFolder;
  return 'prepared';
}
