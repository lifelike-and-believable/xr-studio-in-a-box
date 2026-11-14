export type Env = Record<string, string | undefined>;

export function productionSetting(env: Env = process.env): boolean {
  void env;
  return false;
}

export function tryMode(env: Env = process.env): boolean {
  void env;
  return true;
}
