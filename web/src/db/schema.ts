import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const at = (name: string) => timestamp(name, { withTimezone: true });

// Read by the health check to show the schema is migrated.
export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// --- The auth library's tables (Better Auth 1.7.22). It makes their ids itself, as text. The
// JS property names are the ones its Drizzle adapter looks up; the schema keys (user, session,
// account, verification, passkey) are its model names.

export const user = pgTable('auth_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: at('created_at').notNull().defaultNow(),
  updatedAt: at('updated_at').notNull().defaultNow(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: at('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: at('created_at').notNull().defaultNow(),
    updatedAt: at('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (t) => [index('session_user_idx').on(t.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: at('access_token_expires_at'),
    refreshTokenExpiresAt: at('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: at('created_at').notNull().defaultNow(),
    updatedAt: at('updated_at').notNull().defaultNow(),
  },
  (t) => [index('account_user_idx').on(t.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: at('expires_at').notNull(),
    createdAt: at('created_at').notNull().defaultNow(),
    updatedAt: at('updated_at').notNull().defaultNow(),
  },
  (t) => [index('verification_identifier_idx').on(t.identifier)],
);

export const passkey = pgTable(
  'passkey',
  {
    id: text('id').primaryKey(),
    name: text('name'),
    publicKey: text('public_key').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    credentialID: text('credential_id').notNull(),
    counter: integer('counter').notNull(),
    deviceType: text('device_type').notNull(),
    backedUp: boolean('backed_up').notNull(),
    transports: text('transports'),
    createdAt: at('created_at'),
    aaguid: text('aaguid'),
  },
  (t) => [index('passkey_user_idx').on(t.userId), index('passkey_credential_idx').on(t.credentialID)],
);

// --- The project record. Ids are UUIDv7, made by the app (decision-project-record-model).

// A person can exist with no auth account: someone added only with roles that do not use the
// dashboard (performer, collaborator, venue attendant) gets none.
export const person = pgTable(
  'person',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name'),
    authUserId: text('auth_user_id').references(() => user.id),
    firstSignedInAt: at('first_signed_in_at'),
    createdAt: at('created_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('person_email_idx').on(sql`lower(${t.email})`), uniqueIndex('person_auth_user_idx').on(t.authUserId)],
);

export const organisation = pgTable('organisation', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: at('created_at').notNull().defaultNow(),
});

// "Looked after by".
export const organisationSteward = pgTable(
  'organisation_steward',
  {
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisation.id, { onDelete: 'cascade' }),
    personId: uuid('person_id')
      .notNull()
      .references(() => person.id),
  },
  (t) => [primaryKey({ columns: [t.organisationId, t.personId] }), index('organisation_steward_person_idx').on(t.personId)],
);

export const project = pgTable(
  'project',
  {
    id: uuid('id').primaryKey(),
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisation.id),
    name: text('name').notNull(),
    brief: text('brief').notNull().default(''),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => person.id),
    createdAt: at('created_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('project_name_in_organisation_idx').on(t.organisationId, sql`lower(${t.name})`)],
);

export const projectRole = pgTable(
  'project_role',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    personId: uuid('person_id')
      .notNull()
      .references(() => person.id),
    role: text('role').notNull(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.personId, t.role] }), index('project_role_person_idx').on(t.personId)],
);

// Who once had a role on a project, so "access removed" can be told apart from "not available".
export const projectRoleRemoved = pgTable(
  'project_role_removed',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    personId: uuid('person_id')
      .notNull()
      .references(() => person.id),
    removedAt: at('removed_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.personId] })],
);

// Invitations are our own records, because the auth library has one link lifetime for every
// magic link (spec, APIs and assumptions). Only a hash of the token is stored.
export const invitation = pgTable(
  'invitation',
  {
    id: uuid('id').primaryKey(),
    personId: uuid('person_id')
      .notNull()
      .references(() => person.id),
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: at('expires_at').notNull(),
    usedAt: at('used_at'),
    replacedAt: at('replaced_at'),
    createdAt: at('created_at').notNull().defaultNow(),
  },
  (t) => [index('invitation_person_idx').on(t.personId)],
);

// Every email sent, for the one-a-minute limit per address.
export const emailSend = pgTable(
  'email_send',
  {
    id: uuid('id').primaryKey(),
    address: text('address').notNull(),
    kind: text('kind').notNull(),
    sentAt: at('sent_at').notNull().defaultNow(),
  },
  (t) => [index('email_send_address_idx').on(sql`lower(${t.address})`, t.sentAt)],
);

// A reference to a sign-in request, so the "no longer works" page can send another link to the
// same address without putting the address in the link.
export const signInRequest = pgTable('sign_in_request', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  returnTo: text('return_to'),
  createdAt: at('created_at').notNull().defaultNow(),
});
