import { describe, expect, it } from 'vitest';
import {
  FUNDERS,
  ORGANISATION_FACTS,
  PROJECT_FACTS,
  factLabel,
  parseFactInput,
  permissionsFor,
} from '../src/index';

describe('facts visible and editable by role (layer1-facts-identifiers-activity#AC-4, AC-34)', () => {
  it('gives the director and producer every fact permission and the activity', () => {
    for (const role of ['director', 'producer'] as const) {
      const can = permissionsFor([role]);
      for (const p of ['see-facts', 'see-budget', 'edit-facts', 'read-activity'] as const) expect(can.has(p)).toBe(true);
    }
  });

  it('lets the technical artist see general facts and the activity, not the budget', () => {
    const can = permissionsFor(['technical-artist']);
    expect([can.has('see-facts'), can.has('see-budget'), can.has('edit-facts'), can.has('read-activity')]).toEqual([
      true,
      false,
      false,
      true,
    ]);
  });

  it('lets the other dashboard roles see general facts only', () => {
    for (const role of ['artist', 'sound-designer', 'interaction-designer', 'capture-crew', 'show-operator'] as const) {
      const can = permissionsFor([role]);
      expect([can.has('see-facts'), can.has('see-budget'), can.has('edit-facts'), can.has('read-activity')]).toEqual([
        true,
        false,
        false,
        false,
      ]);
    }
  });

  it('gives no fact permission to roles that do not use the dashboard', () => {
    for (const role of ['venue-attendant', 'performer', 'collaborator'] as const) {
      expect(permissionsFor([role]).size).toBe(0);
    }
  });
});

describe('fact values are parsed and checked (layer1-facts-identifiers-activity#AC-3)', () => {
  it('lists the project facts in order', () => {
    expect(PROJECT_FACTS.map(factLabel)).toEqual([
      'Description',
      'Plan',
      'Budget',
      'Credits',
      'Collaborators',
      'Schedule',
      'Work samples',
      'Capacity',
    ]);
    expect(ORGANISATION_FACTS.map(factLabel)).toEqual(['Legal name', 'Bio', 'Company history']);
    expect(FUNDERS.map((f) => f.name)).toEqual([
      'Canada Council for the Arts',
      'Canada Media Fund',
      'Creative BC',
      'Epic MegaGrants',
    ]);
  });

  it('reads the budget total in whole Canadian dollars', () => {
    for (const total of ['148000', '148,000', '$148,000', ' $148,000 ']) {
      expect(parseFactInput('budget', { total, note: 'Fees' })).toEqual({
        ok: true,
        value: { total: 148000, note: 'Fees' },
      });
    }
    for (const total of ['', '148000.50', 'about 148k', '-5']) {
      expect(parseFactInput('budget', { total, note: '' })).toEqual({
        ok: false,
        fields: { total: 'Enter the total in whole Canadian dollars, like 148000.' },
      });
    }
  });

  it('reads capacity as two whole numbers, 0 allowed', () => {
    expect(parseFactInput('capacity', { guests: '40', online: '0' })).toEqual({ ok: true, value: { guests: 40, online: 0 } });
    expect(parseFactInput('capacity', { guests: 'forty', online: '2.5' })).toEqual({
      ok: false,
      fields: {
        guests: 'Enter the number of guests in the room as a whole number, like 40.',
        online: 'Enter the number of viewers online as a whole number, like 200.',
      },
    });
  });

  it('takes text for the text facts and the four funder profile fields, none required', () => {
    expect(parseFactInput('description', { text: 'A lantern keeper.' })).toEqual({ ok: true, value: { text: 'A lantern keeper.' } });
    expect(parseFactInput('funder-profile-creative-bc', {})).toEqual({
      ok: true,
      value: { applicantName: '', category: '', profileNumber: '', mandate: '' },
    });
  });
});
