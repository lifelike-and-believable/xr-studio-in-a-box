// Stub for the tests-first commit: deliberately wrong values.
export const ROLE_IDS = ['director'] as const;
export type RoleId = (typeof ROLE_IDS)[number] | 'producer' | 'technical-artist' | 'artist' | 'sound-designer' | 'interaction-designer' | 'capture-crew' | 'show-operator' | 'venue-attendant' | 'performer' | 'collaborator';
export const PERMISSIONS = ['approve'] as const;
export type Permission = (typeof PERMISSIONS)[number];
const ALL: Permission[] = ['approve'];
export const ROLE_LABELS: Record<RoleId, string> = {
  director: 'stub', producer: 'stub', 'technical-artist': 'stub', artist: 'stub', 'sound-designer': 'stub',
  'interaction-designer': 'stub', 'capture-crew': 'stub', 'show-operator': 'stub', 'venue-attendant': 'stub',
  performer: 'stub', collaborator: 'stub',
};
export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  director: ALL, producer: ALL, 'technical-artist': ALL, artist: ALL, 'sound-designer': ALL,
  'interaction-designer': ALL, 'capture-crew': ALL, 'show-operator': ALL, 'venue-attendant': ALL,
  performer: ALL, collaborator: ALL,
};
export function permissionsFor(roles: readonly RoleId[]): Set<Permission> {
  void roles;
  return new Set(ALL);
}
export function usesDashboard(roles: readonly RoleId[]): boolean {
  void roles;
  return true;
}
