---
id: epic-environment-path
status: approved
derived-from:
  - requirements-content#REQ-content-5: 790eb9d7bfd6
  - persona-artist#goals: 0767918db571
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-director#goals: a92ca172be83
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# From a brief to a world people can move through

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

An environment, with its interactive features, can go from a brief and references to an engine-ready level, ending at a review gate.

## Personas

- persona-artist: builds and revises environments without code.
- persona-technical-artist: keeps levels within budget and engine conventions.
- persona-director: approves layout, look and interactive features.
- persona-interaction-designer: places the designed interactions in the world.

## Proposed stories

- Generate a rough world that can be walked from a brief and references with World Labs Marble.
- Build a rough layout from a kit of approved assets when a generated world does not serve.
- Develop the look of an environment from approved concept art.
- Bring hand-made environment work into the path.
- Place designed interactions in a level.
- Check that a level is engine-ready against each target's budget file.
- Approve layout, look and interactive features at the gate.

## Stories

- story-environment-path-generate-a-world
- story-environment-path-build-from-kit
- story-environment-path-develop-the-look
- story-environment-path-bring-hand-made-work
- story-environment-path-place-interactions
- story-environment-path-engine-ready-level
- story-environment-path-approve-at-the-gate

## Release groups

- Layout, look and the gate ship together.
- Placing interactions ships after epic-interaction-design has its first stories.

## Dependencies

- epic-review-and-status, for gates.
- epic-provenance-and-policy.
- epic-interaction-design.
- epic-asset-checks, for the checks and each target's budget file.

## Open questions

- Answered: World Labs Marble comes first, generating whole worlds, with a kit of approved assets, generated or hand-made, as the fallback (approver's answer). RealityScan photogrammetry and Gaussian splats come later. The proposed stories assumed one unnamed route that blocked out a layout first and added the look after. Marble generates layout and look together, so the first story now generates a world with Marble, and a story for the kit fallback is added. See story-environment-path-generate-a-world and story-environment-path-build-from-kit.
- Answered: a level is engine-ready when it passes the asset checks (story-asset-checks-check-against-budget) against the budget file of each target the project uses, checked in the editor or on the test device that budget file names. A story is added for this check. See story-environment-path-engine-ready-level.

## Out of scope

- Venue layouts and physical alignment, which belong to epic-venue-setup.
