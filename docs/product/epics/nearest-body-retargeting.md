---
id: epic-nearest-body-retargeting
status: approved
derived-from:
  - requirements-performance#REQ-performance-12: 524eaef180f9
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-performer#goals: 9de25c7bbe59
---

# Retarget a performer to the nearest body plan

<!-- Layer 2, live puppetry. -->

## Outcome

A technical artist can have a character whose body does not match the performer's matched automatically to the nearest known body plan, correct the result by hand without code, and save it as a mapping, so a performer can drive a new creature live without a mapping built from scratch.

## Personas

- persona-technical-artist: sets up retargeting for characters whose bodies do not match the performer's.
- persona-performer: drives a body very different from their own, and feels it respond at once.

## Proposed stories

- Match a character to the nearest known body plan automatically, and see which parts were matched and which were not.
- Correct the automatic result by hand, without code, and save it as a mapping asset (story-shared-characters-map-a-different-body).
- Drive a retargeted character live, within the show's delay target (story-live-puppet-measure-delay).
- Add a body plan to the known set, without modifying the core.
- Rehearse a retargeted mapping on a proxy character and send it for review before it is used in show mode.

## Stories

- None yet.

## Release groups

- Automatic matching, manual correction and live driving ship together: this is the smallest proof of the method.
- Adding a body plan and rehearsal can then ship on their own.

## Dependencies

- epic-live-puppet, for channels, the common interface and the UE5 mannequin skeleton.
- epic-shared-characters, for the mapping asset and its rules.
- Proxy characters with body plans different from the mannequin, such as a quadruped and a simple creature.

## Open questions

- Which body plans make up the first known set? The proposal is the biped UE5 mannequin, a quadruped and one creature with extra limbs.
- Does Unreal's IK Retargeter cover the automatic match, or is another tool needed? It must stay within the show's delay target.

## Out of scope

- AI motion filling in parts the match cannot drive, which comes with AI assists in Layer 7.
- Generating the characters themselves, which belongs to the content layer.
