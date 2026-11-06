---
id: epic-behaviour-and-limits
status: approved
derived-from:
  - requirements-characters#REQ-characters-4: ad5330e05ad1
  - requirements-characters#REQ-characters-5: 92dc7ed6491a
  - requirements-characters#REQ-characters-6: 385066da375b
  - requirements-characters#REQ-characters-7: de6ae6b249f1
  - requirements-characters#REQ-characters-8: b437b4f14d13
  - persona-director#goals: a92ca172be83
  - persona-show-operator#goals: 408315e4f8f6
  - persona-collaborator#goals: 72c41c51284f
---

# Autonomous behaviour that stays inside agreed limits

<!-- Layer 7, AI assists, crowds and creatures. -->

## Outcome

Each autonomous character has a reviewed behaviour specification, a scripted fallback and content limits, can be overridden at any time, and is tested before a public show.

## Personas

- persona-director: reviews specifications and limits.
- persona-show-operator: can pause, redirect or take over.
- persona-collaborator: knows cultural protocols bind what characters do.

## Proposed stories

- Write a human-readable behaviour specification, and review it at a gate.
- Check any AI use in a specification against the policy record.
- Give every behaviour a scripted fallback that runs offline.
- Pause, redirect or take over an autonomous character.
- Set content limits, and keep output outside them from reaching the audience.
- Test behaviour with recorded scenarios and statistical checks, and block a failing build.

## Stories

- None yet.

## Release groups

- Specifications, fallbacks and override ship first.
- Limits ship with them, because a person must approve them.
- Statistical tests ship before the first public show with autonomy.

## Dependencies

- epic-review-and-status.
- epic-provenance-and-policy.
- epic-session-operations.

## Open questions

- How are recorded scenarios made without keeping guest data?
- What pass rate counts for a statistical check?

## Out of scope

- Guests' data in AI services, which belongs to the legal review of REQ-governance-7.
