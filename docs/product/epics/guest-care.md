---
id: epic-guest-care
status: approved
derived-from:
  - requirements-audience#REQ-audience-12: f8f45538ca5b
  - requirements-audience#REQ-audience-13: 61f864344fa1
  - requirements-audience#REQ-audience-16: f56a930f3220
  - requirements-audience#REQ-audience-17: b56663eb17d8
  - requirements-audience#REQ-audience-20: 8698259cef4f
  - requirements-governance#REQ-governance-7: 1c4ca4fdf4c8
  - persona-audience-member#goals: e1b5f3ebc15b
  - persona-venue-attendant#goals: ee33f70fd41e
  - persona-director#goals: a92ca172be83
---

# Welcome every guest, and look after them

<!-- Layer 6, audience. -->

## Outcome

Guests enter through a pre-show with the notices, consent and warnings they need, have the access options the show offers, and are kept safe in the room, with what is captured about them limited and declared.

## Personas

- persona-audience-member: knows what to expect, and what is captured.
- persona-venue-attendant: helps guests in and out.
- persona-director: holds the approval for audience-facing safety and consent.

## Proposed stories

- Enter through a standard pre-show that a show can restyle.
- See notices, give consent and read warnings before entering.
- Choose captions, audio description, a sign-interpreted view, seating or low motion, where the show offers them.
- Offer several languages without rework.
- Keep guests clear of hazards and each other, and name an aftercare step.
- Declare what guest data is kept, delete it at session end, and record guardian consent where minors may attend.

## Stories

- None yet.

## Release groups

- The pre-show, notices and data rules ship first: nothing runs in public without them.
- Access options and languages ship before the first show that offers them.
- Room safety ships before the first show where guests walk.

## Dependencies

- epic-remote-guests.
- epic-venue-setup.
- Legal review of REQ-governance-7, which is pending.

## Open questions

- What does the legal review say about each jurisdiction, and about sensing and room views?
- Who reviews the access work? It was written without Deaf or disabled artists.
- How do venue insurance and local rules affect walking guests?

## Out of scope

- Live translation (REQ-audience-18), which is later.
- AI-generated sign language, which is never used.
