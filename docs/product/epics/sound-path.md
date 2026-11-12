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
  - persona-performer#goals: 72110c93fc2a
---

# Sound that fits the show on every output

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

Voices, music, effects and ambience go from a brief to sound placed in a show, under the same gates as visual assets, with a spatial mix for each output that stays in sync with picture.

## Personas

- persona-sound-designer: drafts, places and mixes sound, and tunes it in rehearsal.
- persona-director: approves sound and music at their gate.
- persona-show-operator: runs the mixes during a show.
- persona-performer: decides how their live voice may be processed.

## Proposed stories

- Manage sound as assets with gates, provenance and policy checks.
- Turn a brief into drafts of music, effects and ambience, and approve them.
- Place sound in the world, and hear it spatially on targets that support it.
- Set a mix for each output, including live voices and external feeds.
- Process a live voice in real time, within the performer's agreement.
- Change levels and mixes in rehearsal, and save them to the show without a new build.

## Stories

- story-sound-path-sound-assets
- story-sound-path-brief-to-drafts
- story-sound-path-place-sound
- story-sound-path-mix-per-output
- story-sound-path-live-voice-processing
- story-sound-path-rehearsal-mix-changes

## Release groups

- Sound assets and the gate ship first.
- Placement and per-output mixes ship together.
- Live voice processing and rehearsal changes can each ship on their own.

## Dependencies

- epic-review-and-status.
- epic-provenance-and-policy.
- epic-outputs-and-streaming, for outputs.
- epic-cue-list and epic-live-signals, for mixes that follow cues and signals.
- epic-venue-setup, for venue speaker layouts.
- epic-session-recording, for the performer's agreement on their voice.

## Open questions

- Answered: both. Sound designers prepare stems in their audio workstation, and the live show mixes in Unreal with MetaSounds and submixes, so it runs with no extra machine and follows cues and signals (approver's answer). See story-sound-path-sound-assets and story-sound-path-mix-per-output.
- Answered: binaural for headsets and stereo for the stream and the browser come first, with the room's sound system, stereo first, for the first show's hybrid room (UC-2). Other speaker layouts for venues are added per venue (proposal, PR pending approval). See story-sound-path-place-sound and story-sound-path-mix-per-output.
- Answered: settled in story-sound-path-mix-per-output by measuring the sound-to-picture offset at each output with a test signal, a flash and a click, against a target that a person with the director's role, or their delegate, sets for the show.

## Out of scope

- Generated voices of real people without consent, which the policy gate blocks.
- Generated voices, which come later. The first show uses the performer's live voice (approver's decision).
