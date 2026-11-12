---
id: story-character-forms-continuous-change
status: approved
derived-from:
  - epic-character-forms#outcome: a7670ee45062
  - persona-performer#goals: 72110c93fc2a
---

# Change a character continuously while driving it

As Kai, the performer, I want to drive a continuous change in my character, such as growing or shrinking, with my own movement so that I can drive a body that changes while I perform it.

## Acceptance criteria

- Sam, or another person with the technical artist's role, can map a value from Kai's capture onto the character's form and transformation channel through a parameter mapping (story-shared-characters-parameter-mapping), without code. The value drives a continuous change, such as size, or the blend between two approved forms (story-character-forms-morph).
- Sam sets the limits of the change, such as the smallest and largest size, and Kai's movement cannot take it past them. In show mode only an approved version of the mapping runs.
- Driven by the live portable inertial suit, the change follows Kai within the show's delay target (story-live-puppet-measure-delay). A live performer drives it only once their agreement is confirmed (story-session-recording-record-agreement).
- When the character grows or shrinks, its feet stay on the floor, checked in a recorded test (story-session-recording-record-and-replay).
- If Kai's capture drops, the value uses its fallback (story-handover-and-fallback-define-fallback), as in story-shared-characters-parameter-mapping.
- The change keeps following Kai with every agent and the internet disconnected.
