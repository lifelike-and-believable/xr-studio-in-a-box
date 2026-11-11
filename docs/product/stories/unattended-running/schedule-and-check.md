---
id: story-unattended-running-schedule-and-check
status: approved
derived-from:
  - epic-unattended-running#outcome: d435481b65a1
  - persona-venue-attendant#goals: ee33f70fd41e
---

# Start and stop on a schedule, with an automatic pre-show check

As Taylor, the venue attendant, I want an unattended show to start, check itself and stop on a schedule so that each group of guests can start the experience on time, even when I am not there.

## Acceptance criteria

- The director or their delegate can declare a self-guided show (story-branching-shows-self-guided-run) unattended. This story defines an unattended show: a self-guided show that runs with no staff present. It uses screens, projection and similar outputs only. A show with headsets cannot be declared unattended. An agent cannot make or change the declaration. Other stories refer to this meaning by this story's id.
- A person the project names for the venue's schedule (story-project-record-name-approvers), such as Taylor or the producer, sets the opening and closing times for each day. An agent cannot set or change them. The schedule runs from the show machine's own clock, with no internet.
- At each opening, the show starts in show mode (story-show-safety-switch-modes), runs the pre-show check (story-session-operations-pre-show-check) by itself, and opens to guests in its idle state (story-unattended-running-idle-state) only if the check passes. At closing, a session in progress runs to its end, up to a limit the director or their delegate sets, and then the outputs show a closed screen and the show stops.
- If the check fails, the show does not open. It shows its safe holding state and sends an alert (story-unattended-running-holding-state-and-alert) that names the failed item in plain words.
- Each start, check result and stop is written to the show's log (story-unattended-running-maintenance-and-log).
- The story is tested in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with a schedule shortened to minutes, a check forced to fail once, and every agent and the internet disconnected.
