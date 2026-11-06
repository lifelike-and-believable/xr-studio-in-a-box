---
id: epic-show-safety
status: approved
derived-from:
  - requirements-showcontrol#REQ-showcontrol-12: c393bf344c38
  - requirements-showcontrol#REQ-showcontrol-18: c6a18347fe86
  - requirements-showcontrol#REQ-showcontrol-23: 228bb79a0f77
  - requirements-workflow#REQ-workflow-9: 47c300da3132
  - requirements-workflow#REQ-workflow-12: 79ce1380ed45
  - persona-show-operator#goals: 408315e4f8f6
  - persona-performer#goals: 9de25c7bbe59
  - persona-director#goals: a92ca172be83
---

# A show stays safe, even with no agents and no crew

<!-- Layer 4, show control. -->

## Outcome

One control reaches a safe state with no agent or internet, a solo performer has the controls they need, a lost layer does not stop the show, and show mode runs without agents.

## Personas

- persona-show-operator: has one reliable control.
- persona-performer: can stop or pause a solo show while performing.
- persona-director: approves each show's safe state and fallback plan.

## Proposed stories

- Switch explicitly between production and show mode.
- Keep every live function working when all agents are gone.
- Reach a safe state with one control, including house lights and a fire alarm input.
- Run a solo show with stop, pause and handover as controls that cannot be disarmed.
- Declare what continues if a whole layer or link is lost, and rehearse it.

## Stories

- None yet.

## Release groups

- Show mode and the emergency stop ship first: no public show runs without them.
- Solo controls ship before the first solo public show.
- Show-level fallback can ship on its own.

## Dependencies

- epic-cue-list.
- epic-handover-and-fallback.

## Open questions

- What is the safe state for each kind of output, and who approves it on a solo show?
- Which performer gesture or device is reliable enough for an emergency stop?

## Out of scope

- Guests' physical safety in a room, which belongs to epic-guest-care.
