import { uuidv7 } from 'uuidv7';

// Record ids are UUIDv7 made by the app, so records made offline merge cleanly
// (decision-project-record-model).
export const newId = (): string => uuidv7();
