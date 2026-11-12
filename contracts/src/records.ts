import { z } from 'zod';
import { RoleIdSchema } from './roles';

// Request bodies for the /api/v1 record endpoints (layer1-organisations-projects-people, Scope).
// The dashboard's forms send the same shapes to the same commands.

export const EmailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const SignInLinkRequest = z.object({
  email: z.string(),
  next: z.string().optional(),
});

export const CreateOrganisationRequest = z.object({
  name: z.string(),
  stewardIds: z.array(z.uuid()).default([]),
});
export type CreateOrganisationRequest = z.infer<typeof CreateOrganisationRequest>;

export const EditOrganisationRequest = CreateOrganisationRequest;
export type EditOrganisationRequest = z.infer<typeof EditOrganisationRequest>;

export const StartProjectRequest = z.object({
  name: z.string(),
  brief: z.string().default(''),
  organisationId: z.uuid().nullable(),
  ownerId: z.uuid(),
});
export type StartProjectRequest = z.infer<typeof StartProjectRequest>;

export const EditProjectRequest = z.object({
  name: z.string(),
  brief: z.string().default(''),
});
export type EditProjectRequest = z.infer<typeof EditProjectRequest>;

export const AddPersonRequest = z.object({
  email: z.string(),
  name: z.string().optional(),
  roles: z.array(RoleIdSchema),
});
export type AddPersonRequest = z.infer<typeof AddPersonRequest>;

export const SetRolesRequest = z.object({
  roles: z.array(RoleIdSchema),
});
export type SetRolesRequest = z.infer<typeof SetRolesRequest>;

// A refused or invalid command: field errors for forms, or one message.
export const CommandError = z.object({
  status: z.union([z.literal(400), z.literal(403), z.literal(404), z.literal(409)]),
  message: z.string().optional(),
  fields: z.record(z.string(), z.string()).optional(),
});
export type CommandError = z.infer<typeof CommandError>;
