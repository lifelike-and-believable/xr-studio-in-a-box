---
id: story-audience-avatars-follow-best-input
status: approved
derived-from:
  - epic-audience-avatars#outcome: 5457b095ba74
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Follow a guest with the best input their device has

As Jamie, the audience member, I want my avatar to follow me with the best input my device has, and to keep working when that input drops, so that I feel present in the performance on whatever device I have.

## Acceptance criteria

- The embodiment tiers are headset and hand tracking, full-body inside-out tracking, browser or phone input, and passive guided movement (REQ-audience-3). Jamie's avatar follows the best tier Jamie's device offers, found by itself when Jamie joins, with no setup beyond the pre-show device check (story-guest-care-standard-pre-show). Which tiers each target supports is recorded in the interaction design (story-interaction-design-input-per-target).
- A guest's input drops in the sense of story-handover-and-fallback-automatic-switch, with a timeout the interaction designer sets in production mode (story-show-safety-switch-modes). When it drops, the avatar moves to the next tier down, and at last to passive guided movement, with no visible jump, and it returns when the input recovers. Jamie is told what changed in text and with a sound or a vibration. An agent cannot change the timeout in show mode.
- Kai and other guests never see a frozen or broken avatar. The test drops each input in turn and checks the avatar keeps moving within the tier below.
- Tracking drives the avatar live only. It is not recorded, stored or backed up, and no camera image reaches the project or any output. The pre-show notice (story-guest-care-notices-and-warnings) says so, and the holder of the audience-facing safety and consent approval approves it. An agent cannot approve it.
- Until that holder records that the legal review of sensing (REQ-governance-7) is done for the show's region, hand and full-body tracking are used only in tests with crew who know about it. An agent cannot record it.
- The story is tested in the Unreal Editor with each tier's input simulated, and in one rehearsal with real guests on each tier's test device named in its budget file (story-asset-checks-check-against-budget).
