'use client';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { authClient } from '@/auth/client';
import { ErrorSummary, FieldError, describedBy, type FieldErrors } from '@/ui/error-summary';
import { requestLink, type SignInState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      Email me a sign-in link
    </button>
  );
}

export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState<SignInState, FormData>(requestLink, { email: '' });
  const [passkeyFailed, setPasskeyFailed] = useState(false);
  const retry = useRef<HTMLButtonElement>(null);
  const errors: FieldErrors = state.error ? { email: state.error } : {};

  const autofillStarted = useRef(false);

  async function passkey(autoFill: boolean) {
    let result = await authClient.signIn.passkey({ autoFill });
    // A button press cancels a pending autofill request first; in Chromium the first request
    // after that cancellation can fail, so it is tried once more.
    if (result.error && !autoFill && autofillStarted.current) result = await authClient.signIn.passkey();
    if (result.error) {
      if (!autoFill) setPasskeyFailed(true);
      return;
    }
    window.location.assign(next);
  }

  // Offer passkeys in the browser's autofill list once the email field is in use (AC-8).
  function offerAutofill() {
    if (autofillStarted.current || typeof PublicKeyCredential === 'undefined') return;
    if (!PublicKeyCredential.isConditionalMediationAvailable) return;
    autofillStarted.current = true;
    void PublicKeyCredential.isConditionalMediationAvailable().then((ok) => {
      if (ok) void passkey(true);
    });
  }

  useEffect(() => {
    if (passkeyFailed) retry.current?.focus();
  }, [passkeyFailed]);

  return (
    <>
      <ErrorSummary errors={errors} ids={{ email: 'email' }} />
      {passkeyFailed ? (
        <div role="alert" className="summary">
          <p>That passkey did not work.</p>
          <button ref={retry} type="button" className="secondary" onClick={() => void passkey(false)}>
            Try the passkey again
          </button>
        </div>
      ) : null}
      <form action={action} noValidate>
        <input type="hidden" name="next" value={next} />
        <label htmlFor="email">Email address</label>
        <FieldError id="email-error" message={state.error} />
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username webauthn"
          onFocus={offerAutofill}
          defaultValue={state.email}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={describedBy(state.error && 'email-error')}
        />
        <div className="actions">
          <SubmitButton />
        </div>
      </form>
      <h2>Or use a passkey</h2>
      <p className="hint">A passkey lets you sign in on a device you have used before.</p>
      <button type="button" className="secondary" onClick={() => void passkey(false)}>
        Sign in with a passkey
      </button>
    </>
  );
}
