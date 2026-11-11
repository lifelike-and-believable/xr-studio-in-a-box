---
id: story-asset-checks-lower-detail-versions
status: approved
derived-from:
  - epic-asset-checks#outcome: 85507973a80b
  - persona-artist#goals: 0767918db571
---

# Make and check lower-detail versions for each target

As Riley, the artist, I want lower-detail versions of my approved asset made or brought in, and checked against each target's budget for me, so that I can spend my time on what makes the work good.

## Acceptance criteria

- When an approved asset, including an effect or audio, does not pass the asset checks for a target (story-asset-checks-check-against-budget), it needs a lower-detail version for that target. Either Riley brings one in from a chosen tool, and no agent redoes it, or an agent makes one. A version made with an external tool goes through story-provenance-and-policy-block-generation, story-agent-work-spend-limit, story-agent-work-tool-adapter, story-provenance-and-policy-provenance-record and story-provenance-and-policy-quality-and-licence-gate. Every lower-detail version's provenance record names the full version it comes from.
- Each lower-detail version is checked against its target's budget file and compared with the full version, in the editor or on the target's test device: the same views, the same poses for a rigged character, and the same playback for an effect or audio. Sam sets the measure of difference and the threshold for each asset type.
- Lower-detail versions an agent made go to the gate of the full version's area as one batch item, with each version's check results and comparison shown beside the full version, so the person named for that gate accepts or rejects them in one decision (story-review-and-status-decide-on-items). An agent cannot accept them. Versions above the threshold, or that fail a check, are marked in the item in text.
- A lower-detail version that a person made and brought in, and that passes its checks with a difference at or below the threshold, is attached to the approved full version without a new review. Otherwise it goes to the same gate.
- For a locked character, lower-detail versions are changes to the character and wait for the person named for its later changes (story-character-path-lock-character).
- Only Sam, or another person with the technical artist's role, can set or change a measure or threshold. Each change is dated and logged, and the lower-detail versions it covers are compared again. An agent cannot set or change them.
- For a character with a legibility bar on a channel (story-handover-and-fallback-legibility-bar), a lower-detail version always goes to review, and the bar is checked on it in rehearsal before it is used in show mode.
- When the full version changes, its lower-detail versions are marked out of date and are not used until they are made again or checked again.
