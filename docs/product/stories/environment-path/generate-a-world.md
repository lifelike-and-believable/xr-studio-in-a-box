---
id: story-environment-path-generate-a-world
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-artist#goals: 0767918db571
---

# Generate a rough world from a brief

As Riley, the artist, I want to turn a brief and references into a rough world I can walk through so that I get from a brief to a strong first draft quickly.

## Acceptance criteria

- Riley gives a brief and reference images, and an agent generates a world with World Labs Marble. The world opens in the Unreal Editor as a level.
- The level is walkable: Riley can walk through it in the editor at the scale of the UE5 mannequin, without passing through walls or falling through the floor. Other environment-path stories use this meaning.
- The run goes through the policy gate (story-provenance-and-policy-block-generation), the spend limit (story-agent-work-spend-limit), the adapter (story-agent-work-tool-adapter), the provenance record (story-provenance-and-policy-provenance-record) and the quality and licence gate (story-provenance-and-policy-quality-and-licence-gate), then review. Marble follows the licence rule for a tool's first real use (story-character-path-design-drafts).
- The world comes into the project as meshes and materials. Gaussian splats and RealityScan photogrammetry come later and are not in this story.
- Riley can give written feedback and get a regenerated version, with earlier versions kept and comparable (story-review-and-status-feedback-and-versions).
- If Marble cannot run or its result does not serve, Riley can build the layout from the kit instead (story-environment-path-build-from-kit), keeping the same brief and references.
