---
id: story-shared-characters-tracked-prop
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Drive a character or effect from a tracked prop

As Sam, the technical artist, I want to set up a tracked prop to drive a character or an effect in the same way as a performer's body so that props use the same capture mappings as performers.

## Acceptance criteria

- A tracked prop connects as a source through the common interface (story-live-puppet-connect-a-source).
- Sam can assign the prop to a character's channel, or to an effect, in the same way as a performer's source (story-live-puppet-assign-channels), without code.
- The prop's movement reaches the character or effect within the delay target (story-live-puppet-measure-delay).
- The test can use a recorded or simulated prop stream.
- A prop can fire a cue in the same way as a performer's device (story-cue-list-performer-fired).
