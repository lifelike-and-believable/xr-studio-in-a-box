---
id: story-environment-path-build-from-kit
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-artist#goals: 0767918db571
---

# Build a layout from a kit of approved assets

As Riley, the artist, I want to build a rough layout from a kit of approved assets when a generated world does not serve so that I still get from a brief to a strong first draft quickly.

## Acceptance criteria

- The kit is the project's set of environment assets, generated or hand-made, that have each been accepted at their gate. Only accepted assets appear in it. Other stories refer to it by this story's id.
- Riley can ask an agent to draft a layout from the kit for a brief, and then move, add or remove kit pieces in the Unreal Editor, without code.
- The layout is walkable, as defined in story-environment-path-generate-a-world.
- Each piece in the layout keeps its own provenance record (story-provenance-and-policy-provenance-record), so Riley can see which pieces were made by hand.
- Riley can give written feedback on a drafted layout and get a revised version, with earlier versions kept and comparable (story-review-and-status-feedback-and-versions).
