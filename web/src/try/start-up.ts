import type { Env } from './mode';

// What a server instance checks as it starts (trying-the-product#AC-5).
export async function checkStartUp(env: Env, readMark: () => Promise<boolean>, log: (message: string) => void): Promise<void> {
  void env;
  void readMark;
  void log;
}
