import { pgTable, text } from 'drizzle-orm/pg-core';

// Read by the health check to show the schema is migrated.
export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
