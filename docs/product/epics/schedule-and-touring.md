---
id: epic-schedule-and-touring
status: approved
derived-from:
  - requirements-business#REQ-business-9: 4eeb0ef21564
  - requirements-business#REQ-business-10: 9b89d3a183b2
  - persona-producer#goals: d1cc47b03be9
  - persona-capture-crew#goals: a63bac7ade3c
  - persona-performer#goals: 72110c93fc2a
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
- Draft equipment manifests and set-up checklists for each venue.
- Kai sees their own time in kit, their limits and the dated history of both on a limited page (story-schedule-and-touring-time-in-kit).
- Draft a travel checklist for each trip in the schedule: the people called, their travel and load-in calls, how the kit travels and what must be booked. This story defines a travel checklist. A person makes every booking and payment. An agent never books, pays or sends anything outside the project (REQ-workflow-14, REQ-business-8), and never sees passport numbers or similar identifiers (story-contracts-and-payment-protect-sensitive-data).

## Stories

- story-schedule-and-touring-schedule
- story-schedule-and-touring-call-sheets
- story-schedule-and-touring-time-in-kit
- story-schedule-and-touring-manifests-and-checklists
- story-schedule-and-touring-own-time-in-kit
- story-schedule-and-touring-travel-checklist

## Release groups

- Scheduling and call sheets ship first.
- Manifests and checklists ship before the first tour.

## Dependencies

- epic-project-record.
- epic-venue-setup, for venue profiles.
- epic-build-and-install, for the build carried on manifests and installed on set-up checklists.
- epic-performer-support, for the crew channel that tells performers about time in kit.
- epic-handover-and-fallback, for the fallback when a performer stops.

## Open questions

- Answered: limits for time in kit are set per performer by the director or their delegate with the performer, from rehearsal, and the performer can always stop, in story-schedule-and-touring-time-in-kit. The first real limits are set from a rehearsal with a real performer before that story is accepted.
- Answered: touring abroad is in scope for the first release. Customs documents for kit, such as an ATA carnet, and work permits for people are travel checklist items that a person confirms, and their numbers stay in the protected store (story-schedule-and-touring-travel-checklist).

## Out of scope

- Ticketing and capacity management, which are out of scope.
