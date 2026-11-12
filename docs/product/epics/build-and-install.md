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
  - persona-capture-crew#goals: a63bac7ade3c
---

# From approved work to a tested build on a venue machine

<!-- Layer 5, delivery. -->

## Outcome

Approved work becomes a running, tested build, measured against each target's budget, which a technician can install, check and roll back. One authored show runs on every target.

## Personas

- persona-technical-artist: sees why a build failed, and keeps versions under control.
- persona-producer: knows what is in a build and whether it is ready.
- persona-capture-crew: installs a build on a venue machine and rolls it back.

## Proposed stories

- Build a show from its approved stages, with each output stored and reviewable.
- Run asset checks, scripted scenarios and performance measurements as part of a build.
- Measure a build against each target's budget.
- Record the engine and plugin versions of each build, and show differences between targets.
- Install a versioned build on a venue system, check it and roll it back.
- Soak-test an attended show through its longest show day, with sessions, resets, simulated guests in every audience type and the stream, before its first public day.

## Stories

- story-build-and-install-build-from-stages
- story-build-and-install-automatic-checks
- story-build-and-install-measure-against-budget
- story-build-and-install-engine-and-plugin-versions
- story-build-and-install-install-and-roll-back
- story-build-and-install-soak-test-attended-show

## Release groups

- Building and automatic tests ship first.
- Checks on builds against the budget file (story-asset-checks-check-against-budget) ship with building.
- Install and roll back ship before the first venue show.

## Dependencies

- epic-project-record.
- epic-agent-work.
- epic-asset-checks, for the budget file.

## Open questions

- Answered: the budget file for each target, and who sets it, are defined in story-asset-checks-check-against-budget. Its first numbers are set from measurements on proxy assets. This epic measures frame rate, memory and load time again on delivered builds against the same budget file, in story-build-and-install-measure-against-budget.
- Answered: every first-release target builds on Unreal 5.8 or newer, and the project moves to 5.9 once it is stable. Plugin versions are pinned per target and recorded. Whether 5.8 and its plugins cover every first-release target is settled in story-build-and-install-engine-and-plugin-versions: each target's build is checked on its test device with the engine and plugin versions recorded, and a move to a new engine version rebuilds and checks every target again before a public show. Meta's XR plugin labelled for 5.8 was built for 5.7, but standalone Quest headsets are later (REQ-delivery-9), so it does not block the first release.

## Out of scope

- Remote updates (REQ-delivery-10), which are later.
- Rendered export (REQ-delivery-20), which is later.
