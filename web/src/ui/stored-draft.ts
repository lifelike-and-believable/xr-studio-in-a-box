'use client';
import { useMemo, useSyncExternalStore } from 'react';
import type { HeldMatch } from '@/record/commands';

// The text handed from a fact's edit page to its confirmation page and back, kept in session
// storage so it never goes in an address (layer1-facts-identifiers-activity#AC-23).
export type Draft = { values: Record<string, string>; baseVersion: number; held: HeldMatch[]; restoreFrom?: number };

export const draftKey = (ownerId: string, fact: string) => `xr-confirm:${ownerId}:${fact}`;

const subscribe = () => () => undefined;

// undefined while rendering on the server, null when there is none.
export function useStoredDraft(key: string): Draft | null | undefined {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => undefined,
  );
  return useMemo(() => {
    if (raw === undefined) return undefined;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Draft;
    } catch {
      return null;
    }
  }, [raw]);
}
