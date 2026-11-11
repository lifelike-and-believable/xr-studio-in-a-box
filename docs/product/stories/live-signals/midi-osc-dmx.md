---
id: story-live-signals-midi-osc-dmx
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Drive a channel from MIDI, OSC or DMX

As Sam, the technical artist, I want to drive a channel from MIDI, OSC or DMX so that I can add a controller or a lighting desk as a signal without modifying the core.

## Acceptance criteria

- Sam can connect a MIDI device, an OSC sender and a DMX input (Art-Net or sACN), pick a note, controller, message address or DMX channel, and see its live value.
- Each of these can drive a channel through a signal mapping (story-live-signals-map-a-signal), in the same way as audio analysis.
- Adding one of these signals does not change the characters or shows that already use the common interface.
- Each can be tested against recorded or simulated messages when no device is present.
- The signal delay (story-live-signals-audio-analysis) is measured and shown for each, against the show's target.
