---
id: epic-unattended-running
status: approved
derived-from:
  - requirements-showcontrol#REQ-showcontrol-21: bc1a96e5d51d
  - requirements-showcontrol#REQ-showcontrol-26: 272534f56e39
  - persona-venue-attendant#goals: ee33f70fd41e
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# A show that looks after itself

<!-- Layer 4, show control. -->

## Outcome

A self-guided show can run with no staff present, recover from crashes and power cuts, tell a named person when it cannot, and be proved by a soak test before a long run.

## Personas

- persona-venue-attendant: is called only when needed.
- persona-technical-artist: finds out what failed and why.

## Proposed stories

- Start and stop on a schedule, with an automatic pre-show check.
- Hold an idle state when no guests are present.
- Restart after a crash or power cut, and return to idle.
- Show a safe holding state and alert a named person when recovery fails.
- Use a maintenance mode, and read a log of failures and restarts.
- Run a soak test before a long run.

## Stories

- story-unattended-running-schedule-and-check
- story-unattended-running-idle-state
- story-unattended-running-restart-and-recover
- story-unattended-running-holding-state-and-alert
- story-unattended-running-maintenance-and-log
- story-unattended-running-soak-test

## Release groups

- Schedule, idle and restart ship together.
- Alerts, the log and the soak test ship before the first public unattended show.

## Dependencies

- epic-branching-shows.
- epic-session-operations.

## Open questions

- Answered: a soak test runs for at least the show's longest day of scheduled opening times multiplied by a factor the producer sets, starting at two, so at least two show days. See story-unattended-running-soak-test.
- Answered: with no internet, the alert goes over the venue network to the operator console and a local device the project names, in text and sound, and is queued and sent to the named person when the internet returns. See story-unattended-running-holding-state-and-alert.

## Out of scope

- Remote updates and fleet tools (REQ-delivery-10), which are later.
- Any guest data: unattended shows capture none.
