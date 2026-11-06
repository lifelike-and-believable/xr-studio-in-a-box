---
id: epic-audience-avatars
status: approved
derived-from:
  - requirements-audience#REQ-audience-1: 789f39dbb8d3
  - requirements-audience#REQ-audience-2: 652064920fbc
  - requirements-audience#REQ-audience-3: 7c052789754c
  - requirements-audience#REQ-audience-4: 15c22164f765
  - requirements-audience#REQ-audience-5: 850edee1a3bf
  - requirements-audience#REQ-audience-21: 6d703194d93a
  - persona-audience-member#goals: e1b5f3ebc15b
  - persona-interaction-designer#goals: 59b8371fa6c9
  - persona-performer#goals: 9de25c7bbe59
---

# Guests in the world, as whoever the show lets them be

<!-- Layer 6, audience. -->

## Outcome

Guests can appear in the world as avatars or playable characters, follow the best input their device has, react, and hold the roles the show declares, with a simulated crowd for stream viewers.

## Personas

- persona-audience-member: feels present and knows what they can do.
- persona-interaction-designer: designs roles and playable characters.
- persona-performer: can see and sense guests in the world.

## Proposed stories

- Give a guest an avatar in one of the show's appearance tiers.
- Play a character designed for the show, with its own form, movement and abilities.
- Follow a guest with the best input their device has, and fall back when it drops.
- React with cheers, gestures, light or sound.
- Declare guest roles, with guests muted by default.
- Show stream viewers in the world as a simulated crowd.

## Stories

- None yet.

## Release groups

- Avatars, input and reactions ship first.
- Playable characters and roles follow.
- The simulated crowd ships with epic-crowds-and-creatures.

## Dependencies

- epic-character-path.
- epic-remote-guests.
- epic-crowds-and-creatures, for the simulated crowd.

## Open questions

- What counts must each release reach per audience type? REQ-audience-4 leaves them TBD.
- Do likeness avatars belong in the first release, given the legal review?

## Out of scope

- Touch between avatars (REQ-audience-9), which is later.
- Persistent progress (REQ-audience-19), which is later.
