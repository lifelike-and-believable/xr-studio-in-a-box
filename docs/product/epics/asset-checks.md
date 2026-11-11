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

- story-asset-checks-check-against-budget
- story-asset-checks-check-effects-and-audio
- story-asset-checks-check-provenance
- story-asset-checks-show-failures
- story-asset-checks-lower-detail-versions

## Release groups

- Naming, budget and provenance checks ship first.
- Effect and audio checks follow their paths.
- Lower-detail versions can ship once target budgets are set.

## Dependencies

- epic-review-and-status.
- epic-provenance-and-policy.
- epic-build-and-install, for target budgets.

## Open questions

- Answered: each target has a budget file, which the director or their delegate sets. The first numbers are set from measurements on proxy assets before story-asset-checks-check-against-budget is accepted. That story defines the budget file and what it means for an asset to pass the asset checks for a target.
- Answered: lower-detail versions are checked automatically against their target's budget and compared with the full version. They go to review only when a check fails or the difference is above a threshold the technical artist sets, as in story-asset-checks-lower-detail-versions.

## Out of scope

- Legibility bars for signing, which belong to epic-handover-and-fallback.
