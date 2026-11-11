---
id: story-venue-setup-failed-machine-plan
status: approved
derived-from:
  - epic-venue-setup#outcome: a0070cbdbc62
  - persona-show-operator#goals: 408315e4f8f6
---

# Choose and test a plan for a failed show machine

As Alex, the show operator, I want each show to have a chosen and rehearsed plan for a failed show machine so that I can recover from anything, including losing a machine.

## Acceptance criteria

- For each main show machine, the director or their delegate chooses one level in production mode (story-show-safety-switch-modes): a quick restart that resumes at the last cue, a warm spare machine, or a live spare that takes over at once (REQ-delivery-13). An unattended show returns to its idle state instead (story-unattended-running-restart-and-recover). An agent cannot choose or change the level. This story defines a failure plan. Other stories refer to it by this story's id.
- Quick restart: the show restarts on the same machine and, once Alex or another person whose role allows it confirms, resumes at the last cue fired with the world in the state that cue expects (story-session-operations-pause-and-jump). Warm spare: a second machine with the same installed build (story-build-and-install-install-and-roll-back) and venue profile waits ready, and Alex switches to it with one control, at the last cue. Live spare: a second machine runs the show in step and takes over by itself when the main machine drops (story-handover-and-fallback-automatic-switch). An agent cannot restart or switch machines.
- Until the show resumes, each affected output shows its safe view (story-show-safety-declare-safe-state). Alex is told in text and with a sound, the cast and crew named for the session are told on the crew channel (story-performer-support-crew-channel) as text and read aloud, and each performer gets the performer signal's fallback pattern (story-handover-and-fallback-performer-signal).
- The chosen level is rehearsed on the delivered build with the first release's PC VR and projection kit, by ending the main machine's process and by cutting its power, with every agent and the internet disconnected. The time from the failure to the show resuming on each output is measured. The director or their delegate sets the restart or takeover target from these results before this story is accepted, and later tests show pass or fail against it in text.
- The pre-show check (story-session-operations-pre-show-check) confirms that each spare machine is ready and runs the same build version as the main machine.
