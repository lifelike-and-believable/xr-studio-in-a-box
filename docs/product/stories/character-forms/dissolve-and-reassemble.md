---
id: story-character-forms-dissolve-and-reassemble
status: approved
derived-from:
  - epic-character-forms#outcome: a7670ee45062
  - persona-artist#goals: 0767918db571
---

# Dissolve and reassemble a character

As Riley, the artist, I want to make a dissolve and reassembly from a character's own approved form so that I spend my time on what makes the work good, not on modelling a separate asset for it.

## Acceptance criteria

- Riley can make a dissolve and a reassembly for a form approved at the mesh and rig gate (story-character-path-mesh-and-rig), from that form's own mesh and materials, without code. Riley can change its look, such as speed, direction and colour, and see the result in the Unreal Editor.
- A dissolve can end with the character gone, or reassemble into the same form or another approved form of the character.
- The dissolve and reassembly is sent to the visual effects gate like any effect (story-effects-path-revise-and-approve), where it waits for the named person or their delegate. An agent cannot pass it.
- It is a transition and follows the rules for setting up, rehearsing and triggering one (story-character-forms-morph).
- While dissolved, the character's channels keep their sources. When it reassembles, it follows the performer with no recalibration, within the show's delay target (story-live-puppet-measure-delay).
- Riley sees its frame cost against the budget file of each target the project names (story-asset-checks-check-against-budget), in the editor or on the test device that the budget file names.
