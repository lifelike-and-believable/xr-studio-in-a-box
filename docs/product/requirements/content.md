---
id: requirements-content
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Characters, environments and assets requirements

<!-- Source: discovery sections 1, 6, 7, 13, 14. Character design, meshing, rigging and environments are the stages that cost the most time today. -->

## REQ-content-1: Character path

A character can be taken from a brief and references to a rigged, engine-ready asset through stages for design, mesh and rig. The design stage and the mesh-and-rig stage each end at a review gate.

## REQ-content-2: Character styles

The same path supports four styles: realistic humans (including likenesses of performers), stylised or illustrated characters, creatures, animals and spirits, and abstract or energy forms that act as characters. Non-humanoid and non-mesh forms are first-class characters, not special cases.

## REQ-content-3: Common skeleton and retargeting

Characters use a common skeleton convention or an automatic retarget, so any supported capture source can drive any compatible character without hand-rigging per source. Characters with no matching skeleton are driven through REQ-performance-12.

## REQ-content-4: Transformation

A character can change form during a show (for example a human into a spirit or beast). Each form is a reviewed asset, and the transition is a cue that can be rehearsed and triggered. Four kinds of transformation are supported: a morph between two forms; a swap behind an effect; a dissolve or reassembly; and continuous change driven live by a performer, such as growing or shrinking (see REQ-performance-3).

## REQ-content-5: Environment path

An environment, including its interactive features, can be taken from a brief and references to an engine-ready level. Layout, look and interactive features end at a review gate. The interactions themselves are designed under REQ-interaction-1.

## REQ-content-6: Automatic asset checks

Each asset is checked automatically before review for naming, polygon and texture budgets, rig validity, texture and material validity, effect cost, audio format and loudness, and provenance. Failures are shown to the reviewer.

## REQ-content-7: Device-scaled variants

Each asset, including effects and audio, has lower-detail versions for weaker devices, generated or checked against the budget of each target. One authored show runs on every supported target.

## REQ-content-8: Reuse across projects

Characters, rigs, environments and cue structures can be saved to a shared library and reused in new projects, keeping their provenance and terms (see REQ-governance-8). The full view for browsing the library comes later. Provenance records exist from the first release (REQ-governance-3).

## REQ-content-9: Tool freedom for artists

Artists can work in the tools they choose and return results to the workflow. The workflow accepts standard interchange formats and does not require hand-made assets to be redone by agents.

## REQ-content-10: Hair, cloth and costume

Hair, cloth and costume are authored once and scaled per device: simulated live on PC, and simplified on weaker targets.

## REQ-content-11: Audio assets

Character voices, music, sound effects, and ambience and spatial audio are managed as assets under the same gates, provenance records and policy checks as visual assets.

## REQ-content-12: Effects path

A visual effect, such as particles, volumetrics or animated materials, can be taken from a brief and references to an engine-ready asset, and ends at a review gate. Characters, performers, props and cues can drive it (REQ-performance-2, REQ-performance-7).

## REQ-content-13: Sound path

Voices, music, sound effects and ambience can be taken from a brief and references to engine-ready sound placed in a show, and end at a review gate.

## REQ-content-14: Spatial sound and mixes

Sound is placed in the world and heard spatially on targets that support it. Each show sets a mix for each output it uses, such as headsets, venue speakers, the flat stream and browsers (REQ-delivery-3). Live voices are included, and can be processed in real time within the performer's agreement (REQ-governance-9). External feeds, such as a venue's mixing desk, can join a mix. On each output, sound stays in sync with picture. Levels and mixes can be changed in rehearsal and saved to the show without a new build.

## REQ-content-15: Character lock

A character can be locked at a set point before performers rehearse with it. After that, changes need approval from a named person, and the performer is told what changed.

## Constraints

- Performance budgets per target are set by the approver (pending, see requirements-delivery).
- Generated output is a first draft that a person reviews.

## Success measures

- Elapsed time from character brief to approved rig; share of generated assets that pass automatic checks first time; number of review rounds per asset. Each target is set after a baseline is measured on the first project.
