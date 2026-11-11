---
id: story-external-systems-lead-or-follow
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-show-operator#goals: 408315e4f8f6
---

# Choose whether a show leads or follows

As Alex, the show operator, I want to choose whether the show's cue list leads or follows an external cue system, without a rebuild, so that I can run a show from a cue list, a free palette, timecode or any mix of these, whichever system leads.

## Acceptance criteria

- Each show states whether its cue list (story-cue-list-build-a-cue-list) leads, or follows an external cue system that the show names, such as a lighting desk. Alex, or another person whose role allows it, sets this in production mode (story-show-safety-switch-modes) as a setting, with no rebuild or restart. In show mode a change follows the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change it.
- When the show follows, the external system fires the stepped cues, and the show can still use palette, performer-fired and audience-fired cues (story-cue-list-step-and-palette, story-cue-list-performer-fired, story-cue-list-audience-fired). When it leads, its cues can send messages, lighting values and timecode to the systems that follow it.
- The first model tested is a lighting desk leading Unreal, as on RSC Dream: the desk fires cues in Unreal over OSC or MIDI show control (story-external-systems-osc-midi-msc), and a desk sending timecode is tested next. It is tested first against a simulated desk (story-external-systems-simulators), then with a real desk in rehearsal.
- Before the first show's venue is chosen, the director or their delegate records in the project the external systems each candidate venue has, such as its lighting desk, sound or cue software, media server and timecode source. Checking venue profiles against this list is tested with venues in Layer 5 (epic-venue-setup); in Layer 4 it is tested against a simulated profile. Protocols after the lighting desk are built and tested in the order this list needs.
- If a leading external system drops, as defined in story-handover-and-fallback-automatic-switch, Alex is told in plain words and by a sound, and can take the lead with the show's own cue list from the current cue, with no restart.
