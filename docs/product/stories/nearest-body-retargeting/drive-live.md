---
id: story-nearest-body-retargeting-drive-live
status: approved
derived-from:
  - epic-nearest-body-retargeting#outcome: 49852e3af6be
  - persona-performer#goals: 72110c93fc2a
---

# Drive a retargeted character live

As Kai, the performer, I want to drive a character with a body very different from mine through a retargeted mapping so that I feel the character respond at once when I move.

## Acceptance criteria

- Kai, wearing the portable inertial suit, drives the quadruped and the creature with extra limbs from the known set (story-nearest-body-retargeting-match-nearest-body-plan) live in show mode, each through an approved mapping (story-nearest-body-retargeting-correct-and-save). This happens only once Kai's agreement is confirmed (story-session-recording-record-agreement).
- The delay from Kai's movement to the rendered character is measured for each body plan as in story-live-puppet-measure-delay, and is within the show's delay target. Each result is saved with the body plan and mapping version.
- Parts the mapping does not drive hold the character's rest pose, with no visible jump when Kai starts or stops moving.
- If the suit drops, the channels the mapping drives switch to their fallback (story-handover-and-fallback-automatic-switch), as for a character on the common skeleton.
- With every agent and the internet disconnected, Kai keeps driving the character.
