import { z } from 'zod';

// The eleven project roles and what each allows (docs-people-and-roles, "What each role can do").
// The order is the order roles are listed everywhere. This table is hard to reverse
// (decision-identity-and-roles), so it lives here, versioned with the API.
export const ROLE_IDS = [
  'director',
  'producer',
  'technical-artist',
  'artist',
  'sound-designer',
  'interaction-designer',
  'capture-crew',
  'show-operator',
  'venue-attendant',
  'performer',
  'collaborator',
] as const;

export type RoleId = (typeof ROLE_IDS)[number];
export const RoleIdSchema = z.enum(ROLE_IDS);

// No permission is an approval: approvers are named separately (story-project-record-name-approvers).
export const PERMISSIONS = ['open-project', 'see-people', 'manage-people', 'edit-project'] as const;
export type Permission = (typeof PERMISSIONS)[number];

const MANAGER: Permission[] = ['open-project', 'see-people', 'manage-people', 'edit-project'];
const VIEWER: Permission[] = ['open-project', 'see-people'];

export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  director: MANAGER,
  producer: MANAGER,
  'technical-artist': VIEWER,
  artist: VIEWER,
  'sound-designer': VIEWER,
  'interaction-designer': VIEWER,
  'capture-crew': VIEWER,
  'show-operator': VIEWER,
  'venue-attendant': [],
  performer: [],
  collaborator: [],
};

export const ROLE_LABELS: Record<RoleId, string> = {
  director: 'Director',
  producer: 'Producer',
  'technical-artist': 'Technical artist',
  artist: 'Artist',
  'sound-designer': 'Sound designer',
  'interaction-designer': 'Interaction designer',
  'capture-crew': 'Capture crew',
  'show-operator': 'Show operator',
  'venue-attendant': 'Venue attendant',
  performer: 'Performer',
  collaborator: 'Collaborator',
};

// What each role is for, and what it gives in the dashboard today (design-people-and-roles).
export const ROLE_PURPOSE: Record<RoleId, string> = {
  director: 'Leads the creative work.',
  producer: 'Runs the production.',
  'technical-artist': 'Builds and checks the pipeline.',
  artist: 'Makes characters, environments and effects.',
  'sound-designer': 'Makes the sound and music.',
  'interaction-designer': 'Designs how guests take part.',
  'capture-crew': 'Sets up and runs capture suits and sensors.',
  'show-operator': 'Runs the show.',
  'venue-attendant': 'Looks after guests at a venue.',
  performer: 'Performs live.',
  collaborator: 'Contributes work under agreed terms.',
};

export const ROLE_TODAY: Record<RoleId, string> = {
  director: 'sees the whole project, adds and removes people, and edits the project name and brief.',
  producer: 'sees the whole project, adds and removes people, and edits the project name and brief.',
  'technical-artist': 'sees the project and who is on it. Pipeline tools come in later releases.',
  artist: 'sees the project and who is on it. Tools for making work come in later releases.',
  'sound-designer': 'sees the project and who is on it. Sound tools come in later releases.',
  'interaction-designer': 'sees the project and who is on it. Design tools come in later releases.',
  'capture-crew': 'sees the project and who is on it. Capture tools come in later releases.',
  'show-operator': 'sees the project and who is on it. Show tools come in later releases.',
  'venue-attendant': 'nothing; no dashboard sign-in. They get show-time tools in a later release.',
  performer:
    'nothing; no dashboard sign-in. They get a link to their own agreement page when there is something to confirm.',
  collaborator:
    'nothing; no dashboard sign-in. They get a link to a limited page for their own items when there is something to sign off.',
};

export function permissionsFor(roles: readonly RoleId[]): Set<Permission> {
  return new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role]));
}

export function usesDashboard(roles: readonly RoleId[]): boolean {
  return permissionsFor(roles).has('open-project');
}

export function sortRoles(roles: readonly RoleId[]): RoleId[] {
  return ROLE_IDS.filter((role) => roles.includes(role));
}

// "Artist", "Artist and Sound designer", "Director, Producer and Artist".
export function joinLabels(roles: readonly RoleId[]): string {
  const labels = sortRoles(roles).map((role) => ROLE_LABELS[role]);
  if (labels.length <= 1) return labels.join('');
  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`;
}
