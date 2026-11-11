---
id: epic-shared-characters
status: approved
derived-from:
  - requirements-performance#REQ-performance-2: 02b272a46bfa
  - requirements-performance#REQ-performance-7: f536e55fe19f
  - requirements-performance#REQ-performance-8: bdb562dd2c81
  - requirements-performance#REQ-performance-12: 524eaef180f9
  - requirements-performance#REQ-performance-15: 7b441d01f9f3
  - persona-performer#goals: 9de25c7bbe59
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Any number of performers, any kind of body

<!-- Layer 2, live puppetry. -->

## Outcome

Several performers can share one character, one performer can drive several, props can drive characters and effects, a performer can drive a body that does not match their own, and a different performer can take over a role between sessions.

## Personas

- persona-performer: can play a creature, several characters, or a part of a shared puppet.
- persona-technical-artist: builds and saves the mappings, without code.

## Proposed stories

- Run several performers, each driving their own character.
- Split one character's channels between several performers, with each performer shown what they need to perceive of the others, settled by testing with real performers.
- Drive several characters from one performer.
- Drive a character or effect from a tracked prop.
- Map chosen body parts or motion values onto a character with a different body, and save the mapping as a reviewable asset.
- Drive a character by position and intent, with procedural motion filling in the rest.
- Swap the performer in a role between sessions, using that performer's saved calibration and mappings, with no rebuild.

## Stories

- story-shared-characters-several-performers
- story-shared-characters-split-a-character
- story-shared-characters-one-performer-several-characters
- story-shared-characters-tracked-prop
- story-shared-characters-map-a-different-body
- story-shared-characters-intent-and-procedural-motion
- story-shared-characters-swap-performer

## Release groups

- Each story can ship on its own, in the order of the growth path: several performers on their own characters, then one performer on several, then several performers on one.
- Mapping and intent-driven control ship after the first three, because they use the same channel assignment.
- Performer swap can ship on its own, once calibration is saved per performer.

## Dependencies

- epic-live-puppet, for channels and sources.
- epic-handover-and-fallback, so that shared characters keep the same failure behaviour.

## Open questions

- Answered: mapped puppeteering is proved first, as the simplest of the four mapping methods, in story-shared-characters-map-a-different-body.
- Answered: automatic retargeting to the nearest body plan is its own epic, not an eighth story here. See Out of scope.
- Answered: settled in story-shared-characters-split-a-character by a rehearsal test with at least two real performers sharing a proxy character, who set the bar before the story is accepted.

## Out of scope

- Characters on the common skeleton, which are covered by epic-live-puppet.
- Performers in different venues (REQ-delivery-4), which is later.
- Automatic retargeting to the nearest body plan, which is a separate epic, to be written.
