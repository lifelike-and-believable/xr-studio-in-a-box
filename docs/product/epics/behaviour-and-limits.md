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

- story-behaviour-and-limits-write-specification
- story-behaviour-and-limits-check-ai-use
- story-behaviour-and-limits-scripted-fallback
- story-behaviour-and-limits-override
- story-behaviour-and-limits-content-limits
- story-behaviour-and-limits-scenario-tests

## Release groups

- Specifications, fallbacks and override ship first.
- Limits ship with them, because a person must approve them.
- Statistical tests ship before the first public show with autonomy.

## Dependencies

- epic-review-and-status.
- epic-provenance-and-policy.
- epic-session-operations.

## Open questions

- Answered: recorded scenarios are made from simulated guests and recorded performer takes, used only where each performer's agreement allows it, and never from recordings of real guests (REQ-governance-7). Settled in story-behaviour-and-limits-scenario-tests.
- Answered: any output outside the content limits fails the build, with zero tolerance across all recorded scenarios. Every other behaviour check passes at a rate the director or their delegate sets for each show from rehearsal, starting at 95 per cent. A failing build cannot pass the build for a public show gate (story-build-and-install-automatic-checks). Settled in story-behaviour-and-limits-scenario-tests.

## Out of scope

- Guests' data in AI services, which belongs to the legal review of REQ-governance-7.
