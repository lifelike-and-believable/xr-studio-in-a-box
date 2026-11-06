---
id: epic-build-and-install
status: approved
derived-from:
  - requirements-workflow#REQ-workflow-1: 08014dbacab4
  - requirements-delivery#REQ-delivery-2: 20ebf1fde3d2
  - requirements-delivery#REQ-delivery-6: dce8c8cf97f5
  - requirements-delivery#REQ-delivery-7: 98114ef81b49
  - requirements-delivery#REQ-delivery-8: 0ebd1c5f63f6
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
---

# From approved work to a tested build on a venue machine

<!-- Layer 5, delivery. -->

## Outcome

Approved work becomes a running, tested build, measured against each target's budget, which a technician can install, check and roll back. One authored show runs on every target.

## Personas

- persona-technical-artist: sees why a build failed, and keeps versions under control.
- persona-producer: knows what is in a build and whether it is ready.

## Proposed stories

- Build a show from its approved stages, with each output stored and reviewable.
- Run asset checks, scripted scenarios and performance measurements as part of a build.
- Measure a build against each target's budget.
- Record the engine and plugin versions of each build, and show differences between targets.
- Install a versioned build on a venue system, check it and roll it back.

## Stories

- None yet.

## Release groups

- Building and automatic tests ship first.
- Budgets ship once the approver sets them.
- Install and roll back ship before the first venue show.

## Dependencies

- epic-project-record.
- epic-agent-work.

## Open questions

- What are the budgets per target? REQ-delivery-8 leaves them TBD.
- Does Unreal 5.8 and its plugins cover every first-release target? Plugin support is unconfirmed in the research notes.

## Out of scope

- Remote updates (REQ-delivery-10), which are later.
- Rendered export (REQ-delivery-20), which is later.
