---
id: story-effects-path-expose-values
status: approved
derived-from:
  - epic-effects-path#outcome: 91f3c29e25d5
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Expose an effect's values so a show can drive them

As Sam, the technical artist, I want to expose an effect's values so that I can set up the mappings that let performers, props and signals drive it.

## Acceptance criteria

- Sam can mark values of an effect, such as rate, size, colour or intensity, as exposed, each with a name, a range and a default, without code. Exposed values are part of the effect, so a change to them is a new version that goes back to the visual effects gate.
- Each exposed value can be driven through the effects and materials channel (story-live-puppet-assign-channels), a parameter mapping (story-shared-characters-parameter-mapping), a signal mapping (story-live-signals-map-a-signal) or a tracked prop (story-shared-characters-tracked-prop). A driven value never leaves its range.
- A cue (story-cue-list-build-a-cue-list) can set a value. Until that story is built, this is tested with a simulated cue.
- Driven by a recorded stream from the portable inertial suit, the effect changes within the show's delay target (story-live-puppet-measure-delay).
- If the input driving a value drops (story-handover-and-fallback-automatic-switch), the value uses its fallback (story-handover-and-fallback-define-fallback).
- With every agent and the internet disconnected, the exposed values keep following their inputs.
