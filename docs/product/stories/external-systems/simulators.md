---
id: story-external-systems-simulators
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Test the lighting-desk path against simulators and recorded sessions

As Sam, the technical artist, I want to test the lighting-desk integrations against simulators or a recorded session so that I can see why an integration failed and fix the cause once for every project.

## Acceptance criteria

- The protocols on the lighting-desk path (OSC, MIDI show control, DMX over Art-Net or sACN, and LTC timecode) each have a simulator that stands in for the real system in tests. Simulators for the other protocols are later stories in this epic.
- Sam can record the messages a real system sends in rehearsal, and replay them in tests. Replaying the same recording twice gives the same result.
- An automated test can run a show's cue list against simulators with no person present, and checks that every cue fires within the show's cue timing (story-cue-list-step-and-palette). A failure names the cue, the protocol, the expected and the measured time, in plain words.
- Real consoles and audio systems are tested in rehearsal, and each result is recorded with the system, the date and pass or fail.
- Sam can add a simulator for a new protocol without modifying the core (story-agent-work-extend-the-workflow).
