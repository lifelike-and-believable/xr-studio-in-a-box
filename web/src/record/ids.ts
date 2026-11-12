import { uuidv7 } from 'uuidv7';
import { z } from 'zod';

// Record ids are UUIDv7 made by the app, so records made offline merge cleanly
// (decision-project-record-model).
export const newId = (): string => uuidv7();

const IdSchema = z.uuid();

// An id from a URL, a form or a request body is checked before it reaches a query, so a
// malformed one is answered as "not available" and never becomes a database error.
export const isId = (value: unknown): value is string => IdSchema.safeParse(value).success;
