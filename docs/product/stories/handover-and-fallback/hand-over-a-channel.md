---
id: story-handover-and-fallback-hand-over-a-channel
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-capture-crew#goals: a63bac7ade3c
---

# Hand a channel to another driver

As Casey, from the capture and technical crew, I want to hand a channel to another driver without a visible jump so that I can swap a failed device without stopping the session.

## Acceptance criteria

- Casey can hand a channel to another capture source, a device or a recording, while the session runs. Handing a performer's channel to AI mid-scene is not offered.
- Each handover uses one method: a blend over a set time, a pose match before switching, or a cover behind an effect or transformation. A handover with no method chosen uses the default blend, whose time is set per show, so a hard cut happens only when a person chooses one.
- A visible jump is a joint moving further between two rendered frames than a limit the show sets. Casey and the performer set the limit by watching recorded output before the story is accepted. Recorded output of each method on a proxy character shows no visible jump.
- A handover does not stop the show or restart a system, and the performer's measured delay stays within the show's delay target (story-live-puppet-measure-delay) during it.
- In show mode, only a person or a cue can start a handover, never an agent, and each one is logged with who or what started it.
