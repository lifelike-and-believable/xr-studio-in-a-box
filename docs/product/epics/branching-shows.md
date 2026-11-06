---
id: epic-branching-shows
status: approved
derived-from:
  - requirements-showcontrol#REQ-showcontrol-20: 51f7175174c2
  - requirements-interaction#REQ-interaction-7: 201628395be9
  - persona-show-operator#goals: 408315e4f8f6
  - persona-interaction-designer#goals: 59b8371fa6c9
  - persona-director#goals: a92ca172be83
---

# Shows that take different paths, with or without a performer

<!-- Layer 4, show control. -->

## Outcome

A show can split into paths and endings on simple conditions, and a self-guided show can run the same way with no performers or operator.

## Personas

- persona-show-operator: reads a branching list at a glance.
- persona-interaction-designer: designs paths and conditions.
- persona-director: approves every path.

## Proposed stories

- Make a cue depend on a condition.
- Split a show into paths and endings, and rejoin them.
- Show a condition built in Unreal as one item in the cue list.
- Review every path at the gate, and test each with a script.
- Run a show as a self-guided experience, with cues fired by guests or timecode.

## Stories

- None yet.

## Release groups

- Conditions and paths ship together.
- Tests ship with them, because an untested path is a risk in front of an audience.
- The self-guided run follows.

## Dependencies

- epic-cue-list.
- epic-interaction-design.
- epic-session-operations, for jumping to a cue on any path.

## Open questions

- How is a branching list drawn so a stage manager can read it?
- Which safety controls does a self-guided show at home need, with no attendant?

## Out of scope

- Staggered groups in one world (REQ-showcontrol-24), which is later.
- Unattended operation, which belongs to epic-unattended-running.
