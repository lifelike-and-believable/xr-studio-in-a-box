---
id: story-crowds-and-creatures-locked-or-free
status: approved
derived-from:
  - epic-crowds-and-creatures#outcome: 07b3a730e1a2
  - persona-director#goals: a92ca172be83
---

# Mark a moment as locked or free

As Morgan, the director, I want to mark each scene or behaviour as locked or free, and change the choice in rehearsal, so that I can keep the creative bar high and decide what plays as rehearsed and what may vary.

## Acceptance criteria

- Morgan, or their delegate, marks each section (story-cue-list-build-a-cue-list) and each behaviour of a crowd, creature or AI assist (story-crowds-and-creatures-ai-assists) as locked or free. A behaviour inside a locked section is locked. Anything not marked is locked. This story defines locked and free moments. Other stories refer to them by this story's id.
- A locked moment plays the same way on every run: given the same cues and the same performer input, its autonomous behaviours give the same result. A free moment varies within its content limits (epic-behaviour-and-limits).
- Morgan, or their delegate, can change the choice in rehearsal, in production mode (story-show-safety-switch-modes). In show mode a change is a change during a live run (story-session-operations-live-changes). An agent cannot mark or change a moment.
- Morgan, Alex and Sam see in the show tools, in text and not by colour alone, which sections and behaviours are locked and which are free.
- A scripted test runs a locked section repeatedly from the same recorded performer take (story-session-recording-record-and-replay) and checks that every run gives the same result, frame by frame. The number of runs is set by the director or their delegate. The same test on a free section shows that runs differ. The test runs in the Unreal Editor with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), and once in rehearsal.
