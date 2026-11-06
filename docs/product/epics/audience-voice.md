---
id: epic-audience-voice
status: approved
derived-from:
  - requirements-audience#REQ-audience-6: b9ff91aa7865
  - requirements-audience#REQ-audience-8: dead142baede
  - requirements-audience#REQ-audience-11: 8aeedda1a3e2
  - persona-performer#goals: 9de25c7bbe59
  - persona-show-operator#goals: 408315e4f8f6
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Hear from the audience, safely

<!-- Layer 6, audience. -->

## Outcome

Performers and operators can read the audience at a glance, viewers can send chat and reactions under moderation, and guests have personal space, mute and block.

## Personas

- persona-performer: reads the room without watching every avatar.
- persona-show-operator: can mute, hide or remove any guest.
- persona-audience-member: feels safe.

## Proposed stories

- Read a summary of audience presence and reaction at a glance.
- Send text and reactions that reach the performer, the scene or both.
- Set moderation rules for a show, and have a person approve them.
- Keep a personal space around each guest.
- Mute and block other guests.
- Mute, hide or remove a guest during a show.

## Stories

- None yet.

## Release groups

- The summary and moderated chat ship first, because UC-2 needs them.
- Avatar safety ships with epic-audience-avatars.

## Dependencies

- epic-outputs-and-streaming.
- epic-audience-avatars.

## Open questions

- What makes a summary readable while performing? This needs testing with a real performer.
- How does moderation work on a solo show with nobody watching?

## Out of scope

- AI that responds to individual guests (REQ-characters-9), which is later.
