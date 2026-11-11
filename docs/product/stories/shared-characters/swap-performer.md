---
id: story-shared-characters-swap-performer
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-capture-crew#goals: a63bac7ade3c
---

# Swap the performer in a role between sessions

As Casey, the capture crew, I want to put a different performer in a role between sessions using their saved calibration and mappings so that each performer's guided setup and calibration is done once and reused.

## Acceptance criteria

- Each performer's calibration and mappings are saved under their name.
- A person whose role allows it can choose a different performer for a role between sessions. An agent cannot.
- After the swap, the character uses the new performer's calibration and mappings, with no rebuild or re-import of the character.
- The role shows the agreement of the performer now in it (story-session-recording-record-agreement). One performer's agreement never applies to another.
- Changing a channel's driver while the show runs is covered by story-handover-and-fallback-hand-over-a-channel, not this story.
