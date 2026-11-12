import { z } from 'zod';

// Request bodies for the slice 2 endpoints under /api/v1 (layer1-facts-identifiers-activity, Scope).

const Values = z.record(z.string(), z.string());

export const SaveFactRequest = z.object({ values: Values, baseVersion: z.number().int().nonnegative() });
export type SaveFactRequest = z.infer<typeof SaveFactRequest>;

export const RestoreFactRequest = z.object({ version: z.number().int().positive() });

export const ConfirmFactRequest = z.object({
  values: Values,
  baseVersion: z.number().int().nonnegative(),
  answer: z.string(),
  restoreFrom: z.number().int().positive().optional(),
});
export type ConfirmFactRequest = z.infer<typeof ConfirmFactRequest>;

export const RequestUploadRequest = z.object({
  requestId: z.uuid(),
  title: z.string(),
  fileName: z.string().min(1).max(255),
  mediaType: z.string().max(255),
  size: z.number().int().nonnegative(),
});
export type RequestUploadRequest = z.infer<typeof RequestUploadRequest>;

export const ConfirmUploadRequest = z.object({ answer: z.string() });

export const AddFormatRequest = z.object({ name: z.string(), pattern: z.string() });
export const SetFormatRequest = z.object({ on: z.boolean() });

export const ACTIVITY_PAGE_SIZE = 50;
