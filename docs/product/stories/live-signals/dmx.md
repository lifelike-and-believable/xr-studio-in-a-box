---
id: story-live-signals-dmx
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Drive a channel from DMX

As Sam, the technical artist, I want to drive a channel from DMX received over Art-Net or sACN so that I can add a lighting desk as a signal without modifying the core.

## Acceptance criteria

- Sam can receive DMX over Art-Net or over sACN on the venue network, pick a universe and a DMX channel, or a pair of channels read as one 16-bit value, and see its live value.
- A DMX value can drive a channel through a signal mapping (story-live-signals-map-a-signal), in the same way as audio analysis. If DMX stops arriving, the channel uses its fallback as for any dropped input (story-handover-and-fallback-automatic-switch).
- Adding DMX does not change the characters or shows that already use the common interface. Sending DMX to lights and firing cues from DMX are covered by story-external-systems-lighting.
- DMX can be tested against recorded or simulated Art-Net and sACN streams when no desk is present, and it works with every agent and the internet disconnected.
- The signal delay (story-live-signals-audio-analysis) is measured and shown against the show's target, for Art-Net and for sACN.
