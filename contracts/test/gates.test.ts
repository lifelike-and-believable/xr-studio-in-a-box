import { describe, expect, it } from 'vitest';
import {
  AREAS,
  NOT_GATED,
  PROTECTED_APPROVALS,
  REVIEW_TYPE_ERROR,
  acceptedReviewType,
  handoffById,
  handoffsByHand,
  permissionsFor,
} from '../src/index';

// The gate list of REQ-workflow-2 and REQ-workflow-7 (layer1-gates-and-queue#AC-1).
describe('the gate list matches REQ-workflow-2 (layer1-gates-and-queue#AC-1)', () => {
  it('has the four areas and their gated hand-offs in order', () => {
    expect(AREAS.map((a) => [a.label, a.handoffs.map((h) => handoffById(h)?.label)])).toEqual([
      ['Creative', ['Look and concept art', 'Character design', 'Mesh and rig', 'Environments', 'Visual effects', 'Sound and music', 'Interaction design']],
      ['Performance and behaviour', ['Motion and performance quality', 'AI behaviour, voice and dialogue', 'Cue list', 'Audience-facing safety and consent']],
      ['Builds and operations', ['Build for a public show', 'Update to a remote venue', 'Changes during a live run']],
      ['Business', ['Funding applications and reports', 'Contracts and licence terms', 'Spend above a limit', 'Publishing and marketing', 'AI-use statements and credits']],
    ]);
  });

  it('ties each protected approval to the hand-off of the same name', () => {
    expect(PROTECTED_APPROVALS.map((p) => p.label)).toEqual([
      'Contracts and licence terms',
      'Funding applications and reports',
      'Publishing and marketing',
      'Audience-facing safety and consent',
    ]);
    for (const p of PROTECTED_APPROVALS) {
      const h = handoffById(p.handoff);
      expect(h?.label, p.id).toBe(p.label);
      expect(h?.protectedApproval, p.id).toBe(p.id);
    }
    expect(handoffById('cue-list')?.protectedApproval).toBeNull();
    expect(handoffById('audience-facing-safety-and-consent')?.area).toBe('performance-and-behaviour');
  });

  it('names a hand-off that is not gated, and keeps builds out of the hand-sent list', () => {
    expect(NOT_GATED.map((h) => h.label)).toEqual(['Build for rehearsal']);
    expect(handoffById('build-for-rehearsal')?.gated).toBe(false);
    const byHand = handoffsByHand().map((h) => h.id);
    expect(byHand).not.toContain('build-for-a-public-show');
    expect(byHand).not.toContain('update-to-a-remote-venue');
    expect(byHand).not.toContain('changes-during-a-live-run');
    expect(byHand).toContain('contracts-and-licence-terms');
    // 19 gated hand-offs, less the three builds.
    expect(byHand).toHaveLength(16);
  });
});

describe('review files and their types (layer1-gates-and-queue#AC-17)', () => {
  it('takes work sample types and 3D models, and nothing else', () => {
    for (const [type, name] of [
      ['image/png', 'a.png'],
      ['video/mp4', 'a.mp4'],
      ['audio/wav', 'a.wav'],
      ['application/pdf', 'a.pdf'],
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'a.docx'],
      ['model/gltf-binary', 'keeper.glb'],
      ['', 'keeper.gltf'],
      ['application/octet-stream', 'keeper.fbx'],
      ['model/vnd.usdz+zip', 'keeper.usdz'],
    ] as const) {
      expect(acceptedReviewType(type, name), name).toBe(true);
    }
    expect(acceptedReviewType('application/zip', 'a.zip')).toBe(false);
    expect(acceptedReviewType('text/plain', 'a.txt')).toBe(false);
    expect(REVIEW_TYPE_ERROR).toBe('Choose a video, image, audio, PDF, Word or 3D model file.');
  });
});

describe('naming approvers is a permission, not an approval (layer1-gates-and-queue, Roles and permissions)', () => {
  it('belongs to the Director and the Producer only', () => {
    expect(permissionsFor(['director']).has('manage-gates')).toBe(true);
    expect(permissionsFor(['producer']).has('manage-gates')).toBe(true);
    expect(permissionsFor(['technical-artist', 'artist', 'sound-designer']).has('manage-gates')).toBe(false);
  });
});
