---
id: story-review-and-status-see-review-queue
status: approved
derived-from:
  - epic-review-and-status#outcome: adfddef70e61
  - persona-director#goals: a92ca172be83
---

# See every pending approval in one queue

As Morgan, the director, I want to see everything waiting for me in one queue so that review does not become the pipeline's limit.

## Acceptance criteria

- Morgan sees every item waiting for their approval in one list.
- Each item shows a preview, the stage, who requested it and what changed.
- An item is blocking when another stage or item is waiting on its decision. Blocking items are marked as blocking.
- The queue shows only items Morgan can approve.
- Items are grouped by gate, with the oldest blocking item first. Morgan can filter by area and by the delegate it was handed to, and accept a group in one step (story-review-and-status-decide-on-items).
