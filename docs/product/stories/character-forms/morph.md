---
id: story-character-forms-morph
status: approved
derived-from:
  - epic-character-forms#outcome: a7670ee45062
  - persona-performer#goals: 72110c93fc2a
---

# Morph a character between two forms

As Kai, the performer, I want my character to morph between two reviewed forms while I keep driving it so that I feel the puppet respond at once, within the show's delay target (story-live-puppet-measure-delay), while it changes.

## Acceptance criteria

- Sam, or another person with the technical artist's role, can set up a morph between two forms of a character without code. Each form is an asset approved at the mesh and rig gate (story-character-path-mesh-and-rig). It is tested first on the first show's stylised character growing or changing shape (UC-2).
- A transition is a change of form that can be rehearsed and triggered. Sam sets its duration and curve in production mode, and can run it forwards and back any number of times with no new build or restart. A change to it is a new version that goes to the mesh and rig gate (story-character-path-mesh-and-rig), where it waits for the director or their delegate, or, once the character is locked, for the person named for its later changes (story-character-path-lock-character). Only an approved version runs in show mode. Other stories refer to these rules by this story's id.
- The show's operator triggers a transition from a control, or a cue fires it (story-cue-list-build-a-cue-list), including a cue from Kai's gesture or device (story-cue-list-performer-fired). Until those stories are built, this is tested with a simulated cue. An agent cannot trigger a transition in show mode.
- While the morph runs, Kai keeps driving the character. Driven by the live portable inertial suit, the delay stays within the show's delay target (story-live-puppet-measure-delay) before, during and after the morph. A live performer drives it only once their agreement is confirmed (story-session-recording-record-agreement).
- When the two forms use different mappings (story-shared-characters-map-a-different-body, story-shared-characters-parameter-mapping), Kai's sources drive both forms' mappings at once for the whole morph, and the character shown is the blend of the two along the morph's curve, so no part is left undriven. A part that exists on only one form is driven by that form's mapping and grows or fades with the curve. Sam sees the list of such parts before saving the morph. Where two forms cannot be blended, Sam is told so in plain words when saving and uses a swap behind an effect (story-character-forms-swap-behind-effect) instead. This is tested with one form driven by a parameter mapping and one driven by a body mapping.
- If an input drops during the morph (story-handover-and-fallback-automatic-switch), the channel uses its fallback (story-handover-and-fallback-define-fallback) and the morph finishes on its own timing, so the character never stops between forms.
- The morph runs with every agent and the internet disconnected.
