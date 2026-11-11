---
id: epic-session-operations
status: approved
derived-from:
  - requirements-showcontrol#REQ-showcontrol-7: 96f3bd9f0dfe
  - requirements-showcontrol#REQ-showcontrol-13: 2bc6d6476fa9
  - requirements-showcontrol#REQ-showcontrol-14: 7c14f88a2507
  - requirements-showcontrol#REQ-showcontrol-15: eba8f63ecafc
  - requirements-showcontrol#REQ-showcontrol-16: 30f3c5caddc3
  - requirements-showcontrol#REQ-showcontrol-19: 720f248ef569
  - requirements-showcontrol#REQ-showcontrol-25: 8e31da81c936
  - requirements-showcontrol#REQ-showcontrol-28: 9fb6b853f83d
  - persona-show-operator#goals: 408315e4f8f6
  - persona-capture-crew#goals: a63bac7ade3c
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Run a session, and the next one

<!-- Layer 4, show control. -->

## Outcome

An operator can check a show is ready, run a session, recover from problems, and reset for the next session, with several sessions able to run at once as separate copies.

## Personas

- persona-show-operator: stays in control during a session.
- persona-capture-crew: trims and swaps without stopping the show.
- persona-venue-attendant: sees a dark output, and is ready for the next group.

## Proposed stories

- Run one pre-show check, and a shorter one between sessions.
- Pause and resume, and jump to any cue on any path.
- See and change who drives each channel.
- Make and approve a change during a live run, and tell the people it affects.
- Trim alignment or calibration during a session, with each change logged.
- Reset for the next session, and signal that the show is ready.
- See a thumbnail of every output.
- Run several sessions at once as separate copies, each with its own guests, performers, cue position and reset, where resetting one does not change another.

## Stories

- story-session-operations-pre-show-check
- story-session-operations-pause-and-jump
- story-session-operations-routing-control
- story-session-operations-live-changes
- story-session-operations-live-trim
- story-session-operations-reset-for-next-session
- story-session-operations-output-thumbnails
- story-session-operations-several-sessions

## Release groups

- The check, pause, jump and logging ship together.
- Routing control ships with them, because REQ-showcontrol-16 is a first-release control.
- Resets, separate copies and the ready signal ship before the first repeated show.

## Dependencies

- epic-cue-list.
- epic-handover-and-fallback.

## Open questions

- Answered: the target time between sessions is settled in story-session-operations-reset-for-next-session: the time from the end of a session to the ready signal is measured in rehearsal, and the director or their delegate sets the target from the results before the story is accepted.
- Answered: a guest sees a held view or a holding scene that the show declares, approved with the show's safety rules by the holder of the audience-facing safety and consent approval (story-session-operations-reset-for-next-session).

## Out of scope

- The full health and output monitors (REQ-showcontrol-17), which are later.
