---
id: story-show-safety-switch-modes
status: approved
derived-from:
  - epic-show-safety#outcome: f4a6fa9d5258
  - persona-show-operator#goals: 408315e4f8f6
---

# Switch explicitly between production and show mode

As Alex, the show operator, I want production mode and show mode to be distinct, with an explicit and recorded switch between them, so that I can run a show from its cue list knowing that only approved work runs and no agent is in the path.

## Acceptance criteria

- Production mode is for making and rehearsing the show: agents can work, and people can try versions that are not yet approved. Show mode is for running sessions: only approved versions run, as each owning story says, no live function depends on an agent (story-show-safety-without-agents), and everyone at the show works on the venue network with no internet (REQ-delivery-5). This story defines production mode and show mode. Other stories refer to them by this story's id.
- Only a person whose role allows it, such as Alex or the director or their delegate, can switch modes by hand, with a control that asks them to confirm. Each switch is recorded with who made it and when. An agent cannot switch modes.
- A schedule or a restart (story-unattended-running-schedule-and-check, story-unattended-running-restart-and-recover) may start the show in show mode by itself, recorded as automatic with the time and cause, and only into the last approved version of everything. If anything has no approved version, the start is blocked and the person named for the schedule is alerted in text and with a sound (story-unattended-running-holding-state-and-alert).
- Every surface of the show tools shows the current mode in text at all times, not by colour alone. When the mode changes, the cast and crew named for the session are told on the crew channel (story-performer-support-crew-channel), as text and read aloud.
- Before the switch to show mode, the person sees in plain words anything that has no approved version. A session with guests cannot start in show mode until its cue list is accepted at the cue list gate (story-cue-list-build-a-cue-list) and its safe state is approved (story-show-safety-declare-safe-state).
- While a session with guests runs, the show cannot switch to production mode. The session must end, or the show must be in its safe state (story-show-safety-emergency-stop), first. A session with guests that enters production mode ends: it cannot be cleared or carry on, and guests see the safe state until a new session starts in show mode.
- Changes in show mode follow story-session-operations-live-changes, which sets their scope. A request from an agent to change the show is refused and logged.
