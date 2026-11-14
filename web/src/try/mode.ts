export type Env = Record<string, string | undefined>;

// The production setting (design-trying-the-product, condition 2): XR_PRODUCTION with any value
// other than empty or 0, or VERCEL_ENV=production, which Vercel sets itself.
export function productionSetting(env: Env = process.env): boolean {
  const own = env.XR_PRODUCTION ?? '';
  return (own !== '' && own !== '0') || env.VERCEL_ENV === 'production';
}

// Asked first by every try page, route and transport (trying-the-product#AC-1). The production
// setting is checked first, so it wins whatever else is set.
export function tryMode(env: Env = process.env): boolean {
  if (productionSetting(env)) return false;
  return env.XR_TRY === '1';
}
