import { expect, test } from '@playwright/test';
import { FIRST, signIn } from './support/world';

// A studio behind one address keeps signing people in (docs-sign-in; the comment on the auth
// library's rate limit in src/auth/auth.ts). The library resets a path's count only after a
// whole window with no requests, so any limit on checking sign-in links became a lifetime cap
// for an address that signs someone in at least once a minute.
test('sign-in links keep working after many have been checked from one address', async ({ page }) => {
  test.setTimeout(120_000);
  for (let i = 0; i < 130; i++) {
    const checked = await page.request.get(`/api/auth/magic-link/verify?token=not-a-token-${i}&callbackURL=%2F`, { maxRedirects: 0 });
    expect(checked.status(), `check ${i}`).not.toBe(429);
  }
  await signIn(page, FIRST.jordan);
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Sign in');
});
