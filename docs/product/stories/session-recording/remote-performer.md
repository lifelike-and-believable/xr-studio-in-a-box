---
id: story-session-recording-remote-performer
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-performer#goals: 9de25c7bbe59
---

# Drive a character from another location

As Kai, the performer, I want to drive a character in a show from another location over the internet so that the puppet still responds within 100 ms of my moving.

## Acceptance criteria

- Kai, in another location, drives a character in the show over the internet, using the stream from story-session-recording-stream-between-machines.
- Kai's own view of the character stays within the 100 ms performer loop (REQ-performance-5), measured and shown at Kai's location.
- The delay from Kai's movement to the character at the show is measured and shown to the capture crew at both ends.
- If the link drops, the character's channels at the show switch to their fallbacks, and Kai is told through the performer signal, which does not rely on sound or sight alone. A recording of Kai stands in only if Kai's agreement allows it. The show-level fallback plan (REQ-showcontrol-23) belongs to the show control layer.
- The story is tested over a simulated link with a set delay and loss, and once between two real sites over the internet.
