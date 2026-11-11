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
- Keep a self-guided show safe with no attendant.

## Stories

- story-branching-shows-conditional-cue
- story-branching-shows-paths-and-endings
- story-branching-shows-unreal-condition
- story-branching-shows-review-and-test-paths
- story-branching-shows-self-guided-run
- story-branching-shows-self-guided-safety

## Release groups

- Conditions and paths ship together.
- Tests ship with them, because an untested path is a risk in front of an audience.
- The self-guided run follows.

## Dependencies

- epic-cue-list.
- epic-interaction-design.
- epic-session-operations, for jumping to a cue on any path.
- epic-show-safety, for the safe state a self-guided show's stop reaches.

## Open questions

- Answered: the branching list is one flat list in show order, with each branch point, rejoin and ending as a row and each path's conditions shown in text. Whether a stage manager can read it is settled by a test in rehearsal, in which a stage manager or show operator reads a list the size of the first show's and answers set questions, and sets the pass bar. See story-branching-shows-paths-and-endings.
- Answered: a self-guided show needs at least a stop the guest can always reach, which reaches the show's safe state and cannot be disarmed, a pause, the safe state reached by itself on a crash, lost input or a guest leaving the play area, the show's warnings before it starts, and moderation rules set beforehand. The holder of the audience-facing safety and consent approval approves them. This needed its own story, so one was added to the proposed stories. See story-branching-shows-self-guided-safety.

## Out of scope

- Staggered groups in one world (REQ-showcontrol-24), which is later.
- Unattended operation, which belongs to epic-unattended-running.
