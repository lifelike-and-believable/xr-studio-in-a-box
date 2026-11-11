---
id: story-session-recording-record-and-replay
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-capture-crew#goals: a63bac7ade3c
---

# Record a session and replay it

As Casey, the capture crew, I want to record a capture session and replay it to drive the same characters so that I can record sessions, within what the performer has agreed, for replay.

## Acceptance criteria

- Casey can start and stop recording a session, and sees which performers, sources, channels and signals are being recorded. The agreement check (story-session-recording-check-agreement) applies.
- Each recording names the performers, the date, the sources and the version of each performer's agreement in force.
- Casey can replay a recording to drive the same characters and channels as the live session, in rehearsal or tests, with no performer present. Replaying the same recording twice gives the same result.
- An automated test can replay a recording and check the result with no person present.
- A recording keeps every channel's values at the captured rate and timing, not only the rendered result, so later uses such as style continuation are not prevented.
- Recordings are versioned and backed up with the project, and only people whose role allows it can open them. Guest presence data and audience reaction values are never recorded (story-live-signals-audience-reaction); only the channel values they produced are kept.
