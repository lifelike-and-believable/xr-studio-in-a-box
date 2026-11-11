---
id: story-live-puppet-optical-studio-stream
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Connect an optical studio's live stream

As Casey, from the capture and technical crew, I want a guided setup that connects an optical studio's live capture stream and maps its performers to characters so that studio capture reaches the right characters without a pipeline engineer.

## Acceptance criteria

- Casey is guided through connecting the studio's live stream through the common interface (story-live-puppet-connect-a-source), with no code, command line or configuration files.
- Casey sees each performer the stream reports, by the name the studio uses, and maps each one to a character.
- The setup offers no calibration of the studio's own system, and says that the studio's system and staff do it.
- If a mapped performer is missing from the stream, Casey sees which one, in text and with a sound.
- The mapping is saved, and the next session with the same studio can reuse it.
- Until a studio is booked, the story is tested against a recorded or simulated stream.
