---
id: story-environment-path-approve-at-the-gate
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-director#goals: a92ca172be83
---

# Approve layout, look and interactive features at the gate

As Morgan, the director, I want to review a level's layout, look and interactive features at its gate so that I can steer the work and decide what is good.

## Acceptance criteria

- A level reaches Morgan's review queue as one item with three parts: layout, look and interactive features (story-review-and-status-see-review-queue). Each part has a preview, such as a recorded walkthrough and stills.
- Beside the item, Morgan sees the engine-ready result for each target (story-environment-path-engine-ready-level) and which parts were generated or made by hand (story-provenance-and-policy-provenance-record).
- Morgan can accept, request revision or reject each part, singly or in a batch with other items (story-review-and-status-decide-on-items).
- The level does not leave the stage until all three parts are accepted by Morgan or their delegate (story-review-and-status-hold-gated-hand-off). An AI recommendation is marked as one and cannot pass the gate.
