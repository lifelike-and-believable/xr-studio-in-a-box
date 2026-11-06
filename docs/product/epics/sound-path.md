---
id: epic-sound-path
status: approved
derived-from:
  - requirements-content#REQ-content-11: c8f07fb50752
  - requirements-content#REQ-content-13: 05604259cfff
  - requirements-content#REQ-content-14: f9360150356c
  - persona-sound-designer#goals: 70f155e30dc6
  - persona-director#goals: a92ca172be83
  - persona-show-operator#goals: 408315e4f8f6
---

# Sound that fits the show on every output

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

Voices, music, effects and ambience go from a brief to sound placed in a show, under the same gates as visual assets, with a spatial mix for each output that stays in sync with picture.

## Personas

- persona-sound-designer: drafts, places and mixes sound, and tunes it in rehearsal.
- persona-director: approves sound and music at their gate.
- persona-show-operator: runs the mixes during a show.

## Proposed stories

- Manage sound as assets with gates, provenance and policy checks.
- Turn a brief into drafts of music, effects and ambience, and approve them.
- Place sound in the world, and hear it spatially on targets that support it.
- Set a mix for each output, including live voices and external feeds.
- Process a live voice in real time, within the performer's agreement.
- Change levels and mixes in rehearsal, and save them to the show without a new build.

## Stories

- None yet.

## Release groups

- Sound assets and the gate ship first.
- Placement and per-output mixes ship together.
- Live voice processing and rehearsal changes can each ship on their own.

## Dependencies

- epic-review-and-status.
- epic-provenance-and-policy.
- epic-outputs-and-streaming, for outputs.

## Open questions

- Does the first show mix in Unreal, in an audio workstation, or both?
- Which spatial audio format and venue speaker systems come first?
- How is sync measured on a stream with seconds of delay?

## Out of scope

- Generated voices of real people without consent, which the policy gate blocks.
