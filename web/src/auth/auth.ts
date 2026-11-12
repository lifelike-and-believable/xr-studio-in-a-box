import 'server-only';
import { AsyncLocalStorage } from 'node:async_hooks';
import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins/magic-link';
import { db } from '../db/client';
import * as schema from '../db/schema';
import { signInLinkEmail } from '../mail/templates';
import { canSignIn } from '../record/eligibility';
import { sendLimited } from '../record/mail';
import { appOrigins } from '../record/settings';

// A sign-in link lasts 15 minutes (layer1-organisations-projects-people#AC-2).
export const SIGN_IN_LINK_SECONDS = 15 * 60;

// When the app itself needs a sign-in link (to start the session an invitation opens), it runs
// the request inside this store and takes the link instead of mailing it. Requests from outside
// never run inside it, so they can only ever cause an email.
export const linkCapture = new AsyncLocalStorage<{ url?: string }>();

function createAuth() {
  const origins = appOrigins();
  return betterAuth({
    appName: 'XR Studio',
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: { allowedHosts: origins.map((o) => new URL(o).host), protocol: 'auto' },
    trustedOrigins: origins,
    // Per-address mail limits are the record's own (one email a minute, AC-3); this per-IP limit
    // only guards the auth routes against floods, so a studio behind one address is not blocked.
    rateLimit: { window: 60, max: 600 },
    database: drizzleAdapter(db(), {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        passkey: schema.passkey,
      },
    }),
    plugins: [
      magicLink({
        expiresIn: SIGN_IN_LINK_SECONDS,
        disableSignUp: true,
        storeToken: 'hashed',
        rateLimit: { window: 60, max: 120 },
        sendMagicLink: async ({ email, url }) => {
          const capture = linkCapture.getStore();
          if (capture) {
            capture.url = url;
            return;
          }
          if (!(await canSignIn(email))) return;
          await sendLimited(email, 'sign-in', signInLinkEmail({ link: url }));
        },
      }),
      passkey({
        rpName: 'XR Studio',
        // Discoverable passkeys, so a person can sign in with one without typing their address (AC-8).
        authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
        rpID: process.env.PASSKEY_RP_ID ?? 'localhost',
        origin: (process.env.PASSKEY_ORIGINS ?? origins.join(','))
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean),
      }),
      nextCookies(),
    ],
  });
}

let instance: ReturnType<typeof createAuth> | undefined;

export function auth() {
  instance ??= createAuth();
  return instance;
}
