---
id: story-character-forms-morph
status: approved
derived-from:
  - epic-character-forms#outcome: a7670ee45062
  - persona-performer#goals: 9de25c7bbe59
---

# Morph a character between two forms

As Kai, the performer, I want my character to morph between two reviewed forms while I keep driving it so that I feel the puppet respond at once, within 100 ms of moving, while it changes.

## Acceptance criteria

- Sam, or another person with the technical artist's role, can set up a morph between two forms of a character without code. Each form is an asset approved at the mesh and rig gate (story-character-path-mesh-and-rig). It is tested first on the first show's stylised character growing or changing shape (UC-2).
- A transition is a change of form that can be rehearsed and triggered. Sam sets its duration and curve in production mode, and can run it forwards and back any number of times with no new build or restart. A change to it is a new version that goes to the review queue, and only an approved version runs in show mode. Other stories refer to these rules by this story's id.
- In Layer 3 the show's operator triggers a transition from a control in production mode, or a simulated cue triggers it. Firing it as a cue, including from Kai's gesture or device, arrives with epic-cue-list in Layer 4. An agent cannot trigger a transition in show mode.
- While the morph runs, Kai keeps driving the character. Driven by the live portable inertial suit, the delay stays within the show's delay target (story-live-puppet-measure-delay) before, during and after the morph. A live performer drives it only once their agreement is confirmed (story-session-recording-record-agreement).
- If an input drops during the morph (story-handover-and-fallback-automatic-switch), the channel uses its fallback (story-handover-and-fallback-define-fallback) and the morph finishes on its own timing, so the character never stops between forms.
- The morph runs with every agent and the internet disconnected.
