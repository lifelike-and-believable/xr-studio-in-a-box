---
id: story-live-signals-osc
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Drive a channel from OSC

As Sam, the technical artist, I want to drive a channel from OSC messages so that I can add OSC as a signal without modifying the core.

## Acceptance criteria

- Sam can set the port that receives OSC on the venue network, pick an OSC address and one of its arguments, and see its live value.
- An OSC value can drive a channel through a signal mapping (story-live-signals-map-a-signal), in the same way as audio analysis. Many OSC senders send only when a value changes, so for each OSC input Sam chooses how a drop is detected: a keep-alive address the sender must send within a timeout Casey sets, or disconnect only, with no timeout. A dropped OSC input uses its fallback as for any dropped input (story-handover-and-fallback-automatic-switch).
- Adding OSC does not change the characters or shows that already use the common interface. Firing cues from OSC belongs to the show control layer (epic-external-systems).
- OSC can be tested against recorded or simulated messages when no sender is present, and it works with every agent and the internet disconnected.
- The signal delay (story-live-signals-audio-analysis) is measured and shown against the show's target.
