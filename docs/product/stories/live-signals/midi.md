---
id: story-live-signals-midi
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Drive a channel from MIDI

As Sam, the technical artist, I want to drive a channel from a MIDI controller so that I can add a controller as a signal without modifying the core.

## Acceptance criteria

- Sam can connect a MIDI device, pick a note or controller, and see its live value.
- A MIDI value can drive a channel through a signal mapping (story-live-signals-map-a-signal), in the same way as audio analysis.
- Adding MIDI does not change the characters or shows that already use the common interface.
- MIDI can be tested against recorded or simulated messages when no device is present.
- The signal delay (story-live-signals-audio-analysis) is measured and shown against the show's target.
