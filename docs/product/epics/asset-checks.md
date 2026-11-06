---
id: epic-asset-checks
status: approved
derived-from:
  - requirements-content#REQ-content-6: 5699b76f6ce9
  - requirements-content#REQ-content-7: 92caf95ce2b8
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-artist#goals: 0767918db571
---

# Every asset fits every target before anyone reviews it

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

Assets are checked automatically before review, failures are shown to the reviewer, and each asset has versions that fit the budget of each target.

## Personas

- persona-technical-artist: fixes a check once for every project.
- persona-artist: learns about a problem early, in plain terms.

## Proposed stories

- Check naming, polygon and texture budgets, rigs, textures and materials before review.
- Check effect cost and audio format and loudness.
- Check that provenance is complete.
- Show failures to the reviewer beside the item.
- Generate or check lower-detail versions against each target's budget.

## Stories

- None yet.

## Release groups

- Naming, budget and provenance checks ship first.
- Effect and audio checks follow their paths.
- Lower-detail versions can ship once target budgets are set.

## Dependencies

- epic-review-and-status.
- epic-provenance-and-policy.
- epic-build-and-install, for target budgets.

## Open questions

- What are the budgets per target? The approver sets them (REQ-delivery-8), and they are TBD.
- Do lower-detail versions need their own review?

## Out of scope

- Legibility bars for signing, which belong to epic-handover-and-fallback.
