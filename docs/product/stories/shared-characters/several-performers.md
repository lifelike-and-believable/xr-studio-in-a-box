---
id: story-shared-characters-several-performers
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-performer#goals: 72110c93fc2a
---

# Run several performers on their own characters

As Kai, the performer, I want to drive my own character while other performers drive theirs so that my character still responds within 100 ms of my moving when others share the stage.

## Acceptance criteria

- Two or more performers each drive their own proxy character at once, each through the common interface (story-live-puppet-connect-a-source). The test can use one performer and recorded streams for the others.
- The performers can use different kinds of source, such as a suit and a headset.
- With every performer running, each performer's measured delay stays within the delay target (story-live-puppet-measure-delay).
- The capture crew sees which performer drives which character.
- Adding a performer needs no change to the characters already in use.
