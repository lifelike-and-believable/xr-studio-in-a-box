---
id: story-handover-and-fallback-define-fallback
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-capture-crew#goals: a63bac7ade3c
---

# Define a fallback for each channel

As Casey, the capture crew, I want to set what each channel falls back to so that I can swap a failed device without stopping the session.

## Acceptance criteria

- Casey can choose a fallback for each channel of a character: another source, a recording or loop, an AI-held pose or a safe hold. The fallback is the driver a channel uses while its own source has dropped (story-handover-and-fallback-automatic-switch).
- A safe hold keeps the channel in its last good pose, then eases it to the character's rest pose after a time set for the channel. A channel with no fallback chosen uses a safe hold, and Casey can see which channels have no fallback chosen.
- A recording of a performer can be chosen as a fallback only if that performer's agreement allows it. Otherwise it is refused, and Casey is told why.
- If an AI-held pose cannot run, or the performer has switched AI off, the channel uses a safe hold instead. A channel with a legibility bar cannot use an AI-held pose (story-handover-and-fallback-legibility-bar).
- In show mode, a fallback is changed only by a person at the show, and the change is logged with who made it. An agent cannot set or change a fallback.
