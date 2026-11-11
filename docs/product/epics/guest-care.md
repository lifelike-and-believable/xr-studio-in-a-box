---
id: epic-guest-care
status: approved
derived-from:
  - requirements-audience#REQ-audience-12: f8f45538ca5b
  - requirements-audience#REQ-audience-13: 61f864344fa1
  - requirements-audience#REQ-audience-16: f56a930f3220
  - requirements-audience#REQ-audience-17: b56663eb17d8
  - requirements-audience#REQ-audience-20: 8698259cef4f
  - requirements-governance#REQ-governance-7: 13cae58be342
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

- story-guest-care-standard-pre-show
- story-guest-care-notices-and-warnings
- story-guest-care-access-options
- story-guest-care-languages
- story-guest-care-room-safety
- story-guest-care-guest-data

## Release groups

- The pre-show, notices and data rules ship first: nothing runs in public without them.
- Access options and languages ship before the first show that offers them.
- Room safety ships before the first show where guests walk.

## Dependencies

- epic-remote-guests.
- epic-venue-setup.
- Legal review of REQ-governance-7, which is pending.

## Open questions

- Answered: the legal review for each jurisdiction is a gate. Until the holder of the audience-facing safety and consent approval records that it is done for the show's region, capturing guest likeness, voice or body data, and admitting minors, run only in tests with crew who know about it (story-guest-care-guest-data). Sensing and room views follow the same rule in story-live-signals-guest-presence and story-performer-support-room-view. What the review says stays outside input.
- Answered: before the first public show, Deaf and disabled artists, recruited and paid by the producer, review the access work and set the bar. Their findings are recorded in the project, and the first public show cannot be accepted at the build for a public show gate until the review is recorded (story-build-and-install-automatic-checks). Stories can be accepted before it. Settled in story-guest-care-access-options.
- Answered: venue insurance and local rules for walking guests are a gate for each venue. Until the holder of the audience-facing safety and consent approval records that the review is done for the venue, a show with walking guests runs there only in tests and rehearsals with crew who know about it. Settled in story-guest-care-room-safety.

## Out of scope

- Live translation (REQ-audience-18), which is later.
- AI-generated sign language, which is never used.
