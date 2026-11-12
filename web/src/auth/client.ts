'use client';
import { passkeyClient } from '@better-auth/passkey/client';
import { createAuthClient } from 'better-auth/react';

// The browser side of passkeys (layer1-organisations-projects-people#AC-7, AC-8).
export const authClient = createAuthClient({ plugins: [passkeyClient()] });
