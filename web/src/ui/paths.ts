import type { Owner } from '@/record/commands';

// Addresses from decision-navigation-and-urls for an owner's facts pages.
export const factsPath = (o: Owner) => (o.kind === 'project' ? `/projects/${o.id}/facts` : `/organisations/${o.id}`);
const factBase = (o: Owner) => (o.kind === 'project' ? `/projects/${o.id}/facts` : `/organisations/${o.id}/facts`);
export const editPath = (o: Owner, fact: string) => `${factBase(o)}/${fact}/edit`;
export const historyPath = (o: Owner, fact: string) =>
  fact === 'work-samples' || fact === 'standard-work-samples' ? `${samplesPath(o)}/history` : `${factBase(o)}/${fact}/history`;
export const confirmPath = (o: Owner, fact: string) => `${factBase(o)}/${fact}/confirm`;
export const samplesPath = (o: Owner) => (o.kind === 'project' ? `/projects/${o.id}/facts/work-samples` : `/organisations/${o.id}/work-samples`);
