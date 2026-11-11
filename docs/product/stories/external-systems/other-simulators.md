---
id: story-external-systems-other-simulators
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Test the other protocols against simulators

As Sam, the technical artist, I want simulators for MIDI notes and controllers, PosiStageNet and MIDI timecode so that I can see why an integration failed and fix the cause once for every project.

## Acceptance criteria

- MIDI notes and controllers, PosiStageNet and MIDI timecode each have a simulator that stands in for the real system in tests, alongside the lighting-desk simulators (story-external-systems-simulators). A simulator uses the same setup as the real system, so a show needs no change to switch between them.
- Simulators for video streams are in story-external-systems-video-simulators. Each of the simulators in this story can be made to drop (story-handover-and-fallback-automatic-switch) and to send from a sender that is not allowed (story-external-systems-osc-midi-msc). The timecode simulator can also stop, jump and change frame rate.
- Sam can record the MIDI, PosiStageNet and MIDI timecode messages a real system sends in rehearsal, and replay them in tests. Replaying the same recording twice gives the same result. Recordings are made only in rehearsals with no guests, and a recording that shows a performer is kept and used only as their agreement allows (story-session-recording-record-agreement).
- An automated test can run a show against these simulators and those in story-external-systems-simulators, with no person present. It checks that every cue fires within the show's cue timing (story-cue-list-step-and-palette), and that each position and timecode arrives within a target delay with a tolerance, both set by Sam from repeated measurements. An agent cannot set them. A failure names the cue or stream, the protocol, the expected and the measured value, in plain words. The tests run with every agent and the internet disconnected.
- Real devices for these protocols are tested in rehearsal, and each result is recorded with the system, the date and pass or fail.
- Sam can add a simulator for a new protocol without modifying the core (story-agent-work-extend-the-workflow).
