---
id: story-handover-and-fallback-return-recovered-source
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-capture-crew#goals: a63bac7ade3c
---

# Return a recovered source to its channel

As Casey, the capture crew, I want a recovered or replaced source to take its channel back without a visible jump so that I can swap a failed device without stopping the session.

## Acceptance criteria

- When the dropped source, or a replacement device Casey has set up, sends valid data again, the channel returns to it using the method set for that channel, or the default blend (story-handover-and-fallback-hand-over-a-channel). Recorded output shows no visible jump.
- The channel returns only after the source has sent valid data for a settling time set for the channel, so a source that keeps dropping does not move the channel back and forth.
- For each channel, Casey can choose whether the return happens by itself or waits for a person to confirm it.
- After the return, Casey can see that the source drives the same character and channel as before.
- Kai gets the "recovered" performer signal (story-handover-and-fallback-performer-signal), and the return is logged.
