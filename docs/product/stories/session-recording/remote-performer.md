---
id: story-session-recording-remote-performer
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-performer#goals: 72110c93fc2a
---

# Drive a character from another location

As Kai, the performer, I want to drive a character in a show from another location over the internet so that I feel the puppet respond at once, wherever I perform from.

## Acceptance criteria

- Kai, in another location, drives a character in the show over the internet, using the stream from story-session-recording-stream-between-machines.
- Kai's own view of the character stays within the show's delay target (story-live-puppet-measure-delay), measured and shown at Kai's location.
- The delay from Kai's movement to the character at the show is measured and shown to the capture crew at both ends.
- If the link drops (story-handover-and-fallback-automatic-switch), the character's channels at the show switch to their fallbacks, and Kai gets the performer signal's fallback pattern (story-handover-and-fallback-performer-signal). A recording of Kai stands in only if Kai's agreement allows standing in (story-session-recording-record-agreement). The show-level fallback plan (REQ-showcontrol-23) is covered by story-show-safety-show-level-fallback.
- The story is tested over a simulated link with a delay and loss that Casey sets. A test between two real sites is a separate story.
