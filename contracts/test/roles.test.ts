import { describe, expect, it } from 'vitest';
import {
  PERMISSIONS,
  ROLE_IDS,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  permissionsFor,
  usesDashboard,
} from '../src/index';

// The table in docs/user/people-and-roles.md, "What each role can do".
const MANAGERS = ['open-project', 'see-people', 'manage-people', 'edit-project'];
const VIEWERS = ['open-project', 'see-people'];

describe('permission table matches the role table (layer1-organisations-projects-people#AC-35)', () => {
  it('lists the eleven roles in the documented order', () => {
    expect(ROLE_IDS.map((id) => ROLE_LABELS[id])).toEqual([
      'Director',
      'Producer',
      'Technical artist',
      'Artist',
      'Sound designer',
      'Interaction designer',
      'Capture crew',
      'Show operator',
      'Venue attendant',
      'Performer',
      'Collaborator',
    ]);
  });

  it('gives each role the documented permissions', () => {
    expect([...ROLE_PERMISSIONS.director].sort()).toEqual([...MANAGERS].sort());
    expect([...ROLE_PERMISSIONS.producer].sort()).toEqual([...MANAGERS].sort());
    for (const role of ['technical-artist', 'artist', 'sound-designer', 'interaction-designer', 'capture-crew', 'show-operator'] as const) {
      expect([...ROLE_PERMISSIONS[role]].sort(), role).toEqual([...VIEWERS].sort());
    }
    for (const role of ['venue-attendant', 'performer', 'collaborator'] as const) {
      expect(ROLE_PERMISSIONS[role], role).toEqual([]);
      expect(usesDashboard([role]), role).toBe(false);
    }
    expect(usesDashboard(['performer', 'artist'])).toBe(true);
  });

  it('gives two roles the union of their permissions', () => {
    expect([...permissionsFor(['artist', 'producer'])].sort()).toEqual([...MANAGERS].sort());
    expect([...permissionsFor(['performer', 'artist'])].sort()).toEqual([...VIEWERS].sort());
  });

  it('carries no approval', () => {
    expect(PERMISSIONS.some((p) => /approv/.test(p))).toBe(false);
  });
});
