---
id: story-character-forms-hair-cloth-costume
status: approved
derived-from:
  - epic-character-forms#outcome: a7670ee45062
  - persona-artist#goals: 0767918db571
---

# Author hair, cloth and costume once for every device

As Riley, the artist, I want to author a character's hair, cloth and costume once and have them scaled for each device so that I spend my time on what makes the work good, not on remaking it for each device.

## Acceptance criteria

- Riley authors hair, cloth and costume once on a form approved at the mesh and rig gate (story-character-path-mesh-and-rig). Each target the project names gets its own version from that source: simulated live on PC, and simplified on weaker targets, such as baked motion or fewer strands. Riley does not remake it per target.
- When Riley changes the source, every target's version is updated, and Riley sees in text which targets changed.
- Each target's version is checked against that target's budget file (story-asset-checks-check-against-budget), in the editor or on the test device that the budget file names. Riley sees in plain text which version fails and why.
- How much is simulated live is measured on the first show's characters on the show's hardware against the show's delay target (story-live-puppet-measure-delay), with the simulation on. Sam, or another person with the technical artist's role, sets what is simulated live from that measurement, and anything that does not fit is simplified. An agent cannot change it in show mode.
- The simulation runs with every agent and the internet disconnected.
