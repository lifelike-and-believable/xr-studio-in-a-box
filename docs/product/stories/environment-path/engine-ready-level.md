---
id: story-environment-path-engine-ready-level
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Check that a level is engine-ready for every target

As Sam, the technical artist, I want to check a level against each target's budget so that I can see why it fails on a target and fix the cause.

## Acceptance criteria

- A level is engine-ready when it passes the asset checks (story-asset-checks-check-against-budget) against the budget file of each target the project uses, such as the mobile stream, PC VR and projection. Other stories refer to it by this story's id.
- The budget files are those of story-asset-checks-check-against-budget, set by the director or their delegate. An agent cannot change a budget file.
- Sam can run the checks on the whole level and on each asset in it, in the Unreal Editor or on a test device the project names for each target. A delivered build is not needed.
- The result shows pass or fail for each target in text, not by colour alone, with each failure naming the asset, the check, the measured value and the budget.
- One authored level is checked for every target. Lower-detail versions used to pass a weaker target come from story-asset-checks-lower-detail-versions.
