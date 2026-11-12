---
id: story-character-forms-swap-behind-effect
status: approved
derived-from:
  - epic-character-forms#outcome: a7670ee45062
  - persona-performer#goals: 72110c93fc2a
---

# Swap a character behind an effect

As Kai, the performer, I want my character swapped for another form while an effect covers the change so that I can drive several creatures in one show.

## Acceptance criteria

- Sam, or another person with the technical artist's role, can set up a swap from one form to another, each approved at the mesh and rig gate (story-character-path-mesh-and-rig), behind an effect, without code. The effect is one approved at the visual effects gate (story-effects-path-revise-and-approve). Until such an effect exists, it is tested with a proxy effect.
- A swap is a transition and follows the rules for setting up, rehearsing and triggering one (story-character-forms-morph).
- In a recording of the swap at the target's frame rate, no frame shows the character missing, or both forms uncovered by the effect.
- After the swap, Kai's sources drive the new form's channels with no reassignment or recalibration. The new form uses its own mapping where its body differs (story-shared-characters-map-a-different-body), and the delay stays within the show's delay target (story-live-puppet-measure-delay).
- The swap causes no frame over the frame time in the target's budget file (story-asset-checks-check-against-budget), checked in the editor or on the test device that the budget file names.
- The swap runs with every agent and the internet disconnected.
