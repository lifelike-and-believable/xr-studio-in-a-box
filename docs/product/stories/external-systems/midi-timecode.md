---
id: story-external-systems-midi-timecode
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Send and receive MIDI timecode

As Sam, the technical artist, I want the show to receive and send MIDI timecode, as well as LTC, so that I can add timecode sources and followers that use MIDI as integrations without modifying the core.

## Acceptance criteria

- The show can receive MIDI timecode from a MIDI device or a network MIDI port as a clock for timed cues (story-cue-list-timecode-and-music), in the same way as LTC (story-external-systems-video-and-timecode). Sam sets it up without code and in production mode (story-show-safety-switch-modes), and sees the incoming time and its frame rate.
- Only timecode from a sender Sam names, by device or port, is used, as for cue messages (story-external-systems-osc-midi-msc). Timecode from any other sender is ignored and logged. If the incoming frame rate differs from the rate Sam set, the timecode is not used, timed cues act as when timecode stops (story-cue-list-timecode-and-music), and Alex is told in plain words and by a sound.
- The show can send MIDI timecode from its own clock, or pass on the timecode it receives, to a MIDI port Sam names, so other systems follow it. While the show is held (story-session-operations-pause-and-jump), timecode sent from its own clock stops, and it carries on from the same time on resume. After a jump to a cue that has a time, the sent timecode moves to that time. While the emergency stop is in force (story-show-safety-emergency-stop), the show sends no timecode, so systems that follow it fire nothing more.
- A timed cue fires within the show's cue timing (story-cue-list-step-and-palette) of its time, measured against recorded MIDI timecode. The delay from the sender to its arrival is measured and shown on its own.
- The story is tested against simulated and recorded MIDI timecode (story-external-systems-other-simulators), and once in rehearsal with a real device sending it and one following it, which Sam chooses with the director or their delegate before the story is accepted. It works with every agent and the internet disconnected.
- In show mode, only a person whose role allows it changes these settings, following the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change them.
