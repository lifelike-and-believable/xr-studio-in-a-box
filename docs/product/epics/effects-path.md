---
id: epic-effects-path
status: approved
derived-from:
  - requirements-content#REQ-content-12: e17982a61845
  - persona-artist#goals: 0767918db571
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# From a brief to an effect a show can drive

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

A visual effect can go from a brief and references to an engine-ready asset that characters, performers, props and cues can drive, ending at a review gate.

## Personas

- persona-artist: makes effects in chosen tools, and sees what they cost.
- persona-technical-artist: connects effects to channels and cues.

## Proposed stories

- Turn a brief and references into a first draft of an effect.
- Revise an effect from written feedback, and approve it at the gate.
- Expose an effect's values so channels, props and cues can drive them.
- See an effect's cost on each target while working on it.

## Stories

- story-effects-path-draft-an-effect
- story-effects-path-revise-and-approve
- story-effects-path-expose-values
- story-effects-path-see-cost

## Release groups

- Draft, review and driving values ship together.
- The cost view ships with epic-asset-checks.

## Dependencies

- epic-review-and-status.
- epic-live-puppet, for the effects channel.

## Open questions

- Answered: settled in story-effects-path-draft-an-effect by a trial on the first show's effects, in which Sam records which parts agents drafted usefully.

## Out of scope

- Lower-detail versions of effects, which belong to epic-asset-checks.
