'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/auth/client';

function deviceName(): string {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'this device';
  return `${browser} on ${os}`;
}

// **Add a passkey** (layer1-organisations-projects-people#AC-7).
export function AddPasskey() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          setFailed(false);
          // Better Auth gives the browser the name passed here as the passkey's account name, which a
          // password manager shows. Without one, it gives the person's address; the device name,
          // for XR Studio's own list, is set after the passkey exists.
          const result = await authClient.passkey.addPasskey();
          if (!result?.data) {
            setFailed(true);
            return;
          }
          await authClient.passkey.updatePasskey({ id: result.data.id, name: deviceName() });
          router.refresh();
        }}
      >
        Add a passkey
      </button>
      {failed ? <p role="alert">The passkey was not added. Try again.</p> : null}
    </>
  );
}
