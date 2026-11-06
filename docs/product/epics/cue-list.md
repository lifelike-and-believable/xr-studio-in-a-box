---
id: epic-cue-list
status: approved
derived-from:
  - requirements-showcontrol#REQ-showcontrol-1: f18c5a6d2857
  - requirements-showcontrol#REQ-showcontrol-2: 4a5838467122
  - requirements-showcontrol#REQ-showcontrol-8: 5f7539a06c6d
  - requirements-showcontrol#REQ-showcontrol-10: 86e0d6dbb3a6
  - requirements-showcontrol#REQ-showcontrol-11: f023e5198460
  - persona-show-operator#goals: 408315e4f8f6
  - persona-director#goals: a92ca172be83
  - persona-performer#goals: 9de25c7bbe59
---

# Build, rehearse and fire the cues of a show

<!-- Layer 4, show control. -->

## Outcome

A show has a cue list that can be drafted by agents, edited, rehearsed and approved, and whose cues fire in any of five ways, within the show's timing.

## Personas

- persona-show-operator: builds and runs the list.
- persona-director: approves it before a public show.
- persona-performer: fires cues while performing.

## Proposed stories

- Build and edit a cue list that acts on scenes, lighting, sound, characters, cameras and outputs.
- Step through a list, or fire cues from a free palette.
- Fire cues from a performer's gesture or device, armed by section.
- Fire cues from timecode or a music track.
- Fire cues from an audience action, with the count and override the show sets.
- Draft and revise a cue list with agents, and approve it at the gate.

## Stories

- None yet.

## Release groups

- The list, stepping and the palette ship first: this is enough for the first solo show.
- Performer-fired cues follow, because UC-2 needs them.
- Timecode, audience-fired cues and agent drafting can each ship on their own.

## Dependencies

- epic-review-and-status.
- epic-live-puppet.

## Open questions

- Where does the cue list live: in Unreal, or in a separate tool that drives Unreal?
- What timing accuracy does the first show need? REQ-showcontrol-8 leaves it TBD.

## Out of scope

- Branches, which belong to epic-branching-shows.
- Further cue targets and sources (REQ-showcontrol-27), which are later.
