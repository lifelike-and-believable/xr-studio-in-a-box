---
id: story-review-and-status-hold-gated-hand-off
status: approved
derived-from:
  - epic-review-and-status#outcome: adfddef70e61
  - persona-director#goals: a92ca172be83
---

# Hold work at a gate until a person approves

As Morgan, the director, I want to have gated work wait for the named person so that every gate is decided by a person, never by an AI.

## Acceptance criteria

- Work at a gated hand-off does not move on until the named person or their delegate accepts it.
- Work at a hand-off that is not on the gate list moves on without waiting.
- An AI recommendation is marked as a recommendation, and it cannot pass the gate.
- The status of held work shows who it is waiting for.
