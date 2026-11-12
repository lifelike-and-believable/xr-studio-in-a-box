---
id: story-environment-path-make-a-kit-piece
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-artist#goals: 0767918db571
---

# Make a single kit piece and pass it on its own

As Riley, the artist, I want to generate or bring in a single environment piece, such as a crate or a lamp post, and have it accepted on its own so that I can fill the kit and still get from a brief to a strong first draft quickly on a first project.

## Acceptance criteria

- Riley gives a brief and reference images for one piece, and an agent generates it as a mesh with materials through the mesh tool behind the adapter (story-agent-work-tool-adapter), Tripo first, as for characters (story-character-path-mesh-and-rig). The run goes through the same gates and records as a generated world (story-environment-path-generate-a-world). Riley can instead bring the piece in from their own tools (story-environment-path-bring-hand-made-work).
- The piece opens in the Unreal Editor at the scale of the UE5 mannequin and goes through the asset checks against each target's budget file (story-asset-checks-check-against-budget) before review.
- A single piece reaches the environments gate as an item on its own, with a turntable preview, its asset check results and its provenance record (story-provenance-and-policy-provenance-record). Morgan, or their delegate, accepts, requests revision or rejects it, singly or in a batch (story-review-and-status-decide-on-items). An AI recommendation is marked as one and cannot pass the gate.
- Once accepted, the piece is in the kit (story-environment-path-build-from-kit) and Riley can place it in a layout. A piece not yet accepted does not appear in the kit.
- The story is accepted when, on a project with an empty kit, one generated piece and one hand-made piece have each passed the gate and been placed in a walkable layout (story-environment-path-generate-a-world).
