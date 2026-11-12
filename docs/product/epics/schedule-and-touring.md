---
id: epic-schedule-and-touring
status: approved
derived-from:
  - requirements-business#REQ-business-9: 4eeb0ef21564
  - requirements-business#REQ-business-10: 9b89d3a183b2
  - persona-producer#goals: d1cc47b03be9
  - persona-capture-crew#goals: a63bac7ade3c
  - persona-performer#goals: 9de25c7bbe59
---

# Get the right people and kit to the right place

<!-- Business layer, in parallel with the others. Funding comes first. -->

## Outcome

Crew, performers, rehearsals and shoots are scheduled with call sheets, time in kit is tracked, and manifests and checklists are kept for each venue.

## Personas

- persona-producer: keeps availability and call sheets current.
- persona-capture-crew: knows what to bring and how to set up.
- persona-performer: has their time in a headset or suit limited.

## Proposed stories

- Schedule crew and performer availability, rehearsals and shoots.
- Draft call sheets for approval.
- Track each performer's time in a headset or suit against set limits.
- Draft equipment manifests and travel and set-up checklists for each venue.

## Stories

- story-schedule-and-touring-schedule
- story-schedule-and-touring-call-sheets
- story-schedule-and-touring-time-in-kit
- story-schedule-and-touring-manifests-and-checklists

## Release groups

- Scheduling and call sheets ship first.
- Manifests and checklists ship before the first tour.

## Dependencies

- epic-project-record.
- epic-venue-setup, for venue profiles.

## Open questions

- Answered: limits for time in kit are set per performer by the director or their delegate with the performer, from rehearsal, and the performer can always stop, in story-schedule-and-touring-time-in-kit. The first real limits are set from a rehearsal with a real performer before that story is accepted.

## Out of scope

- Ticketing and capacity management, which are out of scope.
