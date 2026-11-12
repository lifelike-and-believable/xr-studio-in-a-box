---
id: story-review-and-status-motion-quality-gate
status: approved
derived-from:
  - epic-review-and-status#outcome: adfddef70e61
  - persona-director#goals: a92ca172be83
---

# Approve motion and performance quality at its gate

As Morgan, the director, I want to see how a performer's motion reads on each character, and approve what it runs through, at the motion and performance quality gate so that I keep the creative bar high and decide what is good before a show is built round it.

## Acceptance criteria

- The motion and performance quality gate (REQ-workflow-2) approves the means of a performance, never a live improvisation in advance. Three kinds of item go to it: a mapping version (story-shared-characters-map-a-different-body), including signal and parameter mappings that drive a character; a cleaned recording that a show plays to guests (story-session-recording-clean-up); and the show's motion bar with its correction settings (story-performer-support-motion-quality-check). This story defines the gate. The approvals of mappings in other stories happen at it.
- A mapping version reaches Morgan's review queue (story-review-and-status-see-review-queue) with a rehearsal take of the performer driving the character through it, a live performer whose agreement is confirmed or a recording whose agreement allows replay in rehearsal (story-session-recording-record-agreement), and the motion quality check's result on that take against the show's bar.
- Morgan, or their delegate, accepts, requests revision or rejects each item (story-review-and-status-decide-on-items). An AI recommendation is marked as one and cannot pass the gate (story-review-and-status-hold-gated-hand-off).
- An item waiting at the gate cannot run in show mode (story-show-safety-switch-modes). Alex sees which items have no approved version when switching modes, as for other gated work.
- What a performer improvises within an approved mapping and bar needs no approval. A change to the mapping or the bar during a live run is a change during a live run (story-session-operations-live-changes).
