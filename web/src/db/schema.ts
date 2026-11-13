import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
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

// --- Slice 2: facts, files, the identifier filter and the activity log
// (layer1-facts-identifiers-activity, Scope). An owner is a project or an organisation, never both.

// Every saved version of a fact. A ledger: the application role may insert and read, never
// update or delete (AC-38).
export const factVersion = pgTable(
  'fact_version',
  {
    id: uuid('id').primaryKey(),
    projectId: uuid('project_id').references(() => project.id),
    organisationId: uuid('organisation_id').references(() => organisation.id),
    fact: text('fact').notNull(),
    number: integer('number').notNull(),
    value: jsonb('value').notNull(),
    savedBy: uuid('saved_by')
      .notNull()
      .references(() => person.id),
    savedAt: at('saved_at').notNull().defaultNow(),
    restoredFrom: integer('restored_from'),
    // The confirmation the person made, or that covered the text, when it was saved (AC-24, AC-32).
    confirmationId: uuid('confirmation_id'),
  },
  (t) => [
    uniqueIndex('fact_version_project_idx').on(t.projectId, t.fact, t.number).where(sql`${t.projectId} is not null`),
    uniqueIndex('fact_version_organisation_idx').on(t.organisationId, t.fact, t.number).where(sql`${t.organisationId} is not null`),
    check('fact_version_one_owner', sql`num_nonnulls(${t.projectId}, ${t.organisationId}) = 1`),
  ],
);

// Files that joined the record. Their bytes stay in object storage even after a sample is
// removed, so restoring an earlier Work samples version brings the file back (AC-12).
export const storedFile = pgTable(
  'stored_file',
  {
    id: uuid('id').primaryKey(),
    projectId: uuid('project_id').references(() => project.id),
    organisationId: uuid('organisation_id').references(() => organisation.id),
    storageKey: text('storage_key').notNull().unique(),
    fileName: text('file_name').notNull(),
    mediaType: text('media_type').notNull(),
    size: bigint('size', { mode: 'number' }).notNull(),
    sha256: text('sha256').notNull(),
    addedBy: uuid('added_by')
      .notNull()
      .references(() => person.id),
    addedAt: at('added_at').notNull().defaultNow(),
  },
  (t) => [check('stored_file_one_owner', sql`num_nonnulls(${t.projectId}, ${t.organisationId}) = 1`)],
);

// An upload in progress, held because its text matched, added, or deleted. Working state.
export const upload = pgTable(
  'upload',
  {
    id: uuid('id').primaryKey(),
    projectId: uuid('project_id').references(() => project.id),
    organisationId: uuid('organisation_id').references(() => organisation.id),
    requestId: uuid('request_id').notNull().unique(),
    title: text('title').notNull(),
    fileName: text('file_name').notNull(),
    mediaType: text('media_type').notNull(),
    declaredSize: bigint('declared_size', { mode: 'number' }).notNull(),
    storageKey: text('storage_key').notNull().unique(),
    state: text('state').notNull().default('pending'),
    heldUntil: at('held_until'),
    // Which formats matched, and on which page of a PDF: never the matching text.
    matches: jsonb('matches'),
    fileId: uuid('file_id').references(() => storedFile.id),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => person.id),
    createdAt: at('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('upload_held_idx').on(t.state, t.heldUntil),
    check('upload_one_owner', sql`num_nonnulls(${t.projectId}, ${t.organisationId}) = 1`),
  ],
);

// An organisation's identifier formats. A starter format has a kind and no pattern; an added
// one has a pattern. Its history is the organisation's activity entries (decision 7).
export const identifierFormat = pgTable(
  'identifier_format',
  {
    id: uuid('id').primaryKey(),
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisation.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    kind: text('kind').notNull(),
    pattern: text('pattern'),
    isOn: boolean('is_on').notNull().default(true),
    starter: boolean('starter').notNull().default(false),
    position: integer('position').notNull().default(0),
    addedBy: uuid('added_by').references(() => person.id),
    addedAt: at('added_at').notNull().defaultNow(),
    removedAt: at('removed_at'),
  },
  (t) => [index('identifier_format_organisation_idx').on(t.organisationId)],
);

// A person's confirmation that matching text is not an identifier. A ledger. It keeps a keyed
// hash of the matching text, never the text (AC-23).
export const identifierConfirmation = pgTable(
  'identifier_confirmation',
  {
    id: uuid('id').primaryKey(),
    projectId: uuid('project_id').references(() => project.id),
    organisationId: uuid('organisation_id').references(() => organisation.id),
    fact: text('fact'),
    uploadId: uuid('upload_id').references(() => upload.id),
    formatIds: jsonb('format_ids').notNull(),
    textHash: text('text_hash').notNull(),
    answer: text('answer').notNull(),
    personId: uuid('person_id')
      .notNull()
      .references(() => person.id),
    at: at('at').notNull().defaultNow(),
  },
  (t) => [
    index('identifier_confirmation_fact_idx').on(t.projectId, t.organisationId, t.fact, t.textHash),
    check('identifier_confirmation_one_owner', sql`num_nonnulls(${t.projectId}, ${t.organisationId}) = 1`),
  ],
);

// The activity log. A ledger: entries are written by commands in the same transaction as their
// change and never changed (AC-33, AC-38).
export const activityEntry = pgTable(
  'activity_entry',
  {
    id: uuid('id').primaryKey(),
    projectId: uuid('project_id').references(() => project.id),
    organisationId: uuid('organisation_id').references(() => organisation.id),
    at: at('at').notNull().defaultNow(),
    actorPersonId: uuid('actor_person_id').references(() => person.id),
    actorKind: text('actor_kind').notNull(),
    area: text('area').notNull(),
    what: text('what').notNull(),
  },
  (t) => [
    index('activity_entry_project_idx').on(t.projectId, t.at),
    index('activity_entry_organisation_idx').on(t.organisationId, t.at),
    check('activity_entry_one_owner', sql`num_nonnulls(${t.projectId}, ${t.organisationId}) = 1`),
  ],
);
