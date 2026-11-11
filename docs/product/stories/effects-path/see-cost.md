---
id: story-effects-path-see-cost
status: approved
derived-from:
  - epic-effects-path#outcome: 91f3c29e25d5
  - persona-artist#goals: 0767918db571
---

# See an effect's cost on each target while working

As Riley, the artist, I want to see what an effect costs on each target while I work on it so that I spend my time on what makes it good rather than reworking it late for weaker devices.

## Acceptance criteria

- While working on an effect in the Unreal Editor, Riley sees its cost on each target the project uses, such as the mobile stream, PC VR and projection, against that target's budget file (story-asset-checks-check-against-budget).
- The cost is measured in the same way as the effect cost check (story-asset-checks-check-effects-and-audio), so Riley sees the same result the reviewer will see.
- After Riley saves a change, the cost shown is updated without a build.
- For each target, Riley sees within or over budget in text, not by colour alone, with the measured value. When an effect is over budget, the costliest part is named in plain terms.
- The cost is measured in the editor or on a test device the project names for each target, not in a delivered build. Lower-detail versions belong to story-asset-checks-lower-detail-versions.
