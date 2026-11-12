---
id: epic-review-and-status
status: approved
derived-from:
  - requirements-workflow#REQ-workflow-2: 53fb042f7baa
  - requirements-workflow#REQ-workflow-3: 47b348a99488
  - requirements-workflow#REQ-workflow-4: 726c1bb7ba8b
  - requirements-workflow#REQ-workflow-5: 890f62acfe2c
  - requirements-workflow#REQ-workflow-15: 06438bddbdf4
  - persona-director#goals: a92ca172be83
  - persona-producer#goals: d1cc47b03be9
  - persona-artist#goals: 0767918db571
---

# Review, approve and see where everything stands

<!-- Layer 1, project backbone. -->

## Outcome

A reviewer can clear every pending approval from one queue, quickly, and anyone on the project can see where each stage and asset stands.

## Personas

- persona-director: approval speed sets the pace of the whole pipeline.
- persona-producer: needs to see what is blocked and who owns it.
- persona-artist: needs to know what is waiting and what the reviewer said.

## Proposed stories

- See every pending approval in one queue, with a preview, the stage, the requester and what changed.
- Accept, request revision or reject an item, singly or in a batch.
- Hold a gated hand-off until the named person approves it, with any AI recommendation marked as such.
- Give written feedback, and compare and restore earlier versions.
- See every stage and asset on a status board, with its owner and state.
- Be told when something is waiting, by a chosen channel, with notifications grouped.
- Approve motion and performance quality at its gate: mappings, cleaned recordings shown to guests and the show's motion bar, with a rehearsal take, never a live improvisation in advance.

## Stories

- story-review-and-status-see-review-queue
- story-review-and-status-decide-on-items
- story-review-and-status-hold-gated-hand-off
- story-review-and-status-feedback-and-versions
- story-review-and-status-status-board
- story-review-and-status-notifications
- story-review-and-status-motion-quality-gate

## Release groups

- The queue, the decision and the gate ship together: a gate with no way to approve would stop all work.
- Version comparison, the status board and notifications can each ship on their own.

## Dependencies

- epic-project-record, for roles and named approvers.

## Open questions

- Answered: notifications default to a daily digest, with an immediate alert only when something is blocking work.
- Answered: email and a dashboard badge come first. Other channels connect later.

## Out of scope

- Collaborator review pages, which belong to epic-provenance-and-policy.
- Stage-specific previews such as rigs and levels, which arrive with the content layer.
