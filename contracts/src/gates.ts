import { z } from 'zod';
import { DOCX_TYPE } from './facts';

// The gate list of REQ-workflow-2, and the four protected approvals of REQ-workflow-7
// (layer1-gates-and-queue#AC-1). Area, hand-off and approval ids appear in addresses and in
// stored assignments, so they are fixed here.

export const AREA_IDS = ['creative', 'performance-and-behaviour', 'builds-and-operations', 'business'] as const;
export type AreaId = (typeof AREA_IDS)[number];

export const PROTECTED_IDS = [
  'contracts-and-licence-terms',
  'funding-applications-and-reports',
  'publishing-and-marketing',
  'audience-facing-safety-and-consent',
] as const;
export type ProtectedId = (typeof PROTECTED_IDS)[number];

export type Handoff = {
  id: string;
  label: string;
  area: AreaId | null;
  gated: boolean;
  protectedApproval: ProtectedId | null;
  // Builds reach their gates from the build pipeline, never from the dashboard's form.
  byHand: boolean;
};

const h = (id: string, label: string, area: AreaId, extra: Partial<Handoff> = {}): Handoff => ({
  id,
  label,
  area,
  gated: true,
  protectedApproval: null,
  byHand: true,
  ...extra,
});

const GATED: Handoff[] = [
  h('look-and-concept-art', 'Look and concept art', 'creative'),
  h('character-design', 'Character design', 'creative'),
  h('mesh-and-rig', 'Mesh and rig', 'creative'),
  h('environments', 'Environments', 'creative'),
  h('visual-effects', 'Visual effects', 'creative'),
  h('sound-and-music', 'Sound and music', 'creative'),
  h('interaction-design', 'Interaction design', 'creative'),
  h('motion-and-performance-quality', 'Motion and performance quality', 'performance-and-behaviour'),
  h('ai-behaviour-voice-and-dialogue', 'AI behaviour, voice and dialogue', 'performance-and-behaviour'),
  h('cue-list', 'Cue list', 'performance-and-behaviour'),
  h('audience-facing-safety-and-consent', 'Audience-facing safety and consent', 'performance-and-behaviour', {
    protectedApproval: 'audience-facing-safety-and-consent',
  }),
  h('build-for-a-public-show', 'Build for a public show', 'builds-and-operations', { byHand: false }),
  h('update-to-a-remote-venue', 'Update to a remote venue', 'builds-and-operations', { byHand: false }),
  h('changes-during-a-live-run', 'Changes during a live run', 'builds-and-operations', { byHand: false }),
  h('funding-applications-and-reports', 'Funding applications and reports', 'business', { protectedApproval: 'funding-applications-and-reports' }),
  h('contracts-and-licence-terms', 'Contracts and licence terms', 'business', { protectedApproval: 'contracts-and-licence-terms' }),
  h('spend-above-a-limit', 'Spend above a limit', 'business'),
  h('publishing-and-marketing', 'Publishing and marketing', 'business', { protectedApproval: 'publishing-and-marketing' }),
  h('ai-use-statements-and-credits', 'AI-use statements and credits', 'business'),
];

export const NOT_GATED: Handoff[] = [
  { id: 'build-for-rehearsal', label: 'Build for rehearsal', area: null, gated: false, protectedApproval: null, byHand: false },
];

const AREA_LABELS: Record<AreaId, string> = {
  creative: 'Creative',
  'performance-and-behaviour': 'Performance and behaviour',
  'builds-and-operations': 'Builds and operations',
  business: 'Business',
};

export const AREAS = AREA_IDS.map((id) => ({ id, label: AREA_LABELS[id], handoffs: GATED.filter((x) => x.area === id).map((x) => x.id) }));

export const PROTECTED_APPROVALS = PROTECTED_IDS.map((id) => {
  const handoff = GATED.find((x) => x.protectedApproval === id);
  if (!handoff) throw new Error(`no hand-off for ${id}`);
  return { id, label: handoff.label, handoff: handoff.id };
});

export const areaLabel = (id: AreaId) => AREA_LABELS[id];
export const isAreaId = (id: string): id is AreaId => (AREA_IDS as readonly string[]).includes(id);
export const isProtectedId = (id: string): id is ProtectedId => (PROTECTED_IDS as readonly string[]).includes(id);
export const protectedLabel = (id: ProtectedId) => PROTECTED_APPROVALS.find((p) => p.id === id)?.label ?? id;

export const gatedHandoffs = (): Handoff[] => GATED;
export const handoffsByHand = (): Handoff[] => GATED.filter((x) => x.byHand);
export const handoffById = (id: string): Handoff | undefined => [...GATED, ...NOT_GATED].find((x) => x.id === id);

// What an assignment is for: one area, or one protected approval.
export type Slot = `area:${AreaId}` | `protected:${ProtectedId}`;
export const SLOTS: Slot[] = [...AREA_IDS.map((a) => `area:${a}` as const), ...PROTECTED_IDS.map((p) => `protected:${p}` as const)];

// The assignment that decides a gated hand-off: its protected approval if it has one, else its area.
export function slotFor(handoff: Handoff): Slot | null {
  if (handoff.protectedApproval) return `protected:${handoff.protectedApproval}`;
  return handoff.area ? `area:${handoff.area}` : null;
}

// --- Review files (layer1-gates-and-queue#AC-17)

export const REVIEW_TYPE_ERROR = 'Choose a video, image, audio, PDF, Word or 3D model file.';
const MODEL_FILE = /\.(glb|gltf|fbx|usdz)$/i;

export function acceptedReviewType(mediaType: string, fileName: string): boolean {
  if (MODEL_FILE.test(fileName)) return true;
  if (/^(video|image|audio)\//.test(mediaType) || mediaType === 'application/pdf' || mediaType === DOCX_TYPE) return true;
  return mediaType === '' && /\.(pdf|docx|mp4|mov|webm|mkv|png|jpe?g|gif|webp|heic|tiff?|mp3|wav|m4a|aac|ogg|flac)$/i.test(fileName);
}

export const isModelFile = (fileName: string) => MODEL_FILE.test(fileName);

// --- Lengths and requests (AC-16, AC-27, AC-39)

export const TITLE_MAX = 120;
export const TEXT_MAX = 2000;

export const SetAreaRequest = z.object({ approverId: z.string(), delegateId: z.string().nullable() });
export const SetHolderRequest = z.object({ holderId: z.string() });

export const SendForReviewRequest = z.object({
  title: z.string(),
  handoff: z.string(),
  whatChanged: z.string(),
  fileId: z.string().nullable(),
  waitingOn: z.string().nullable(),
  answer: z.string().optional(),
});
export type SendForReviewRequest = z.infer<typeof SendForReviewRequest>;

export const DECISIONS = ['accept', 'revise', 'reject'] as const;
export type Decision = (typeof DECISIONS)[number];

export const DecisionRequest = z.object({ decision: z.enum(DECISIONS), feedback: z.string().default(''), answer: z.string().optional() });
export const BatchDecisionRequest = DecisionRequest.extend({ itemIds: z.array(z.string()) });
export const RecommendationRequest = z.object({ result: z.enum(DECISIONS), reason: z.string() });
