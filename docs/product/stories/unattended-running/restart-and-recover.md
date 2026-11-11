---
id: story-unattended-running-restart-and-recover
status: approved
derived-from:
  - epic-unattended-running#outcome: d435481b65a1
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Restart after a crash or power cut, and return to idle

As Sam, the technical artist, I want an unattended show to restart by itself after a crash or power cut and return to idle so that the show keeps running when agents, the internet and staff are gone.

## Acceptance criteria

- If the show crashes, or stops responding for a time Sam sets, it restarts by itself in show mode and returns to the idle state (story-unattended-running-idle-state), with no sign-in, click or agent. Guests who were in a session see the idle state, not the middle of the session.
- After a power cut, when power returns during opening hours (story-unattended-running-schedule-and-check), the show machine starts, the show starts in show mode, runs the pre-show check and returns to the idle state with no one present. Outside opening hours, it waits for the next opening. The machine settings this needs, such as starting when power returns, signing in by itself and holding system updates, are checked by the pre-show check.
- The time from a crash or power return to the idle state is measured and shown beside a target that the director or their delegate sets from rehearsal measurements.
- Recovery fails when the show does not reach the idle state within the target time, or restarts more often than a number of times in a period that Sam sets. The show then moves to its safe holding state (story-unattended-running-holding-state-and-alert).
- Each crash, restart and power return is logged with its time and cause where known (story-unattended-running-maintenance-and-log).
- The story is tested on the budget file's test device (story-asset-checks-check-against-budget), with the show run from the Unreal Editor as a standalone game, by ending the show's process and by cutting the power, both in the idle state and during a session, with every agent and the internet disconnected.
