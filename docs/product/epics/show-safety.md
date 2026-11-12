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
  - persona-performer#goals: 72110c93fc2a
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
- Declare a show's safe state for each kind of output, approved by a person.
- Reach the safe state with one control, including house lights and a fire alarm input.
- Run a solo show with stop, pause and handover as controls that cannot be disarmed.
- Declare what continues if a whole layer or link is lost, and rehearse it.

## Stories

- story-show-safety-switch-modes
- story-show-safety-without-agents
- story-show-safety-declare-safe-state
- story-show-safety-emergency-stop
- story-show-safety-solo-show
- story-show-safety-show-level-fallback

## Release groups

- Show mode and the emergency stop ship first: no public show runs without them.
- Solo controls ship before the first solo public show.
- Show-level fallback can ship on its own.

## Dependencies

- epic-cue-list.
- epic-handover-and-fallback.

## Open questions

- Answered: the safe state for each kind of output, with a default for any the show leaves undeclared, is defined in story-show-safety-declare-safe-state, split from the emergency stop story so each stays one pull request. The holder of the audience-facing safety and consent approval approves it, on a solo show too: the producer, or the solo performer if they hold it.
- Answered: the emergency stop is a wired or local physical button, tested for reliability in rehearsal (story-show-safety-emergency-stop, story-show-safety-solo-show). Gestures come later, once tests show they are reliable.

## Out of scope

- Guests' physical safety in a room, which belongs to epic-guest-care.
