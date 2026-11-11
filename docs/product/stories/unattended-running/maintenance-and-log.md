---
id: story-unattended-running-maintenance-and-log
status: approved
derived-from:
  - epic-unattended-running#outcome: d435481b65a1
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Use a maintenance mode, and read a log of failures and restarts

As Sam, the technical artist, I want a maintenance mode and a log of failures and restarts so that I can see why an unattended show failed and fix the cause once for every project.

## Acceptance criteria

- A person with the venue attendant's or the technical artist's role can put the show into maintenance mode at the show machine or the operator console. An agent cannot. In maintenance mode the schedule and alerts are paused and the outputs show a closed-for-maintenance view. The person can switch to production mode to work (story-show-safety-switch-modes). Each entry and exit is logged with who made it.
- Leaving maintenance mode returns the show to show mode only after the pre-show check passes (story-session-operations-pre-show-check). The show then goes to the idle state, or waits for the next opening.
- The show keeps a log on the show machine of every scheduled start and stop, pre-show check result, crash, restart, power return, failed recovery, alert, acknowledgement and maintenance period, each with its time and its cause in plain words where known. The log is written with no internet, and it survives a power cut.
- The log holds no guest data: nothing about a guest's likeness, voice or body, and nothing that identifies a guest. It records only whether a session was running.
- Sam, or another person with the technical artist's role, can read, filter and export the full log. Taylor sees a plain summary of recent events and what to do next. An agent can read an exported log to draft a diagnosis for Sam, but cannot change the show or its settings.
- The story is tested on the budget file's test device (story-asset-checks-check-against-budget) by forcing each kind of event and checking that it appears in the log, including after a power cut.
