---
id: story-session-recording-clean-up
status: approved
derived-from:
  - epic-session-recording#outcome: 196669ad74cf
  - persona-capture-crew#goals: a63bac7ade3c
---

# Clean up a recorded session

As Casey, the capture crew, I want to clean up a recorded session, with the performer named in its provenance so that I can record sessions, within what the performer has agreed, for cleanup.

## Acceptance criteria

- Casey, or a technical artist, can open a recording (story-session-recording-record-and-replay) in Unreal, correct it with the editor's tools, and save the result as a new version. The original recording is kept unchanged.
- Cleanup runs only where the performer's agreement allows it (story-session-recording-check-agreement).
- The cleaned asset's provenance record names the performer, the source recording, who cleaned it, the tools used and whether AI was used.
- Cleanup with a generative tool goes through the policy gate and the performer's agreement before it runs.
- The cleaned version goes to the review queue like other work.
