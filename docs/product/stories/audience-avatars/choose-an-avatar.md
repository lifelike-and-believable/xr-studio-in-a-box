---
id: story-audience-avatars-choose-an-avatar
status: approved
derived-from:
  - epic-audience-avatars#outcome: 5457b095ba74
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Appear in the world as an avatar chosen from the show's set

As Jamie, the audience member, I want to appear in the world as an avatar I pick from the show's set so that I feel present in the performance and am seen as part of it.

## Acceptance criteria

- A chosen avatar is an abstract or symbolic form, or a stylised figure, that a guest picks from a set the show provides, with no likeness of the guest. The first release offers chosen avatars only. Guest-customised avatars and likenesses of the guest (REQ-audience-2) are later. No camera image or scan of a guest is used to make or drive a chosen avatar. This story defines a chosen avatar. Other stories refer to it by this story's id.
- The director or their delegate chooses the show's appearance tiers and its set of avatars, in production mode (story-show-safety-switch-modes). Each avatar in the set is made through the character path and has passed its gates (story-character-path-mesh-and-rig), and passes the asset checks for each target the show uses (story-asset-checks-check-against-budget). A show can combine a few higher-detail avatars, such as for guests in the venue, with simpler avatars for interactive remote guests, using each target's lower-detail versions (story-asset-checks-lower-detail-versions). An agent can draft avatars but cannot add them to the set.
- For each audience type the show uses (story-remote-guests-join-by-link-or-code), the show declares a guest count: for guests in the venue, the guest count of story-venue-setup-fit-check; for interactive guests, the tier's limit; for player guests, the show's player guest count; and for stream viewers, the show's stream viewer count. The director or their delegate sets each count from a load test on the first release's test kit (story-build-and-install-measure-against-budget) with that many simulated guests. The venue count is load-tested in this story before it is accepted; the interactive, player and stream viewer counts are load-tested in story-remote-guests-interactive-guest, story-remote-guests-player-guest and story-outputs-and-streaming-stream-to-platforms. UC-2's first show sets the starting targets. An agent cannot set a count. This story defines the guest counts per audience type. Other stories refer to it by this story's id.
- Jamie picks an avatar during the pre-show (story-guest-care-standard-pre-show) on whatever device they join with. A guest who does not pick gets a default from the set. Kai and other guests can see Jamie's avatar in the world (REQ-audience-5), and Kai can see guests' avatars in the stage view (story-performer-support-stage-view).
- Jamie's choice of avatar is kept for the session only, so a guest who rejoins gets it back (story-remote-guests-rejoin), and it is deleted at the session's end with other guest data (story-guest-care-guest-data).
- The story is tested in the Unreal Editor run as a standalone game on each target's test device (story-asset-checks-check-against-budget) with simulated guests at the venue guest count, and in one rehearsal with real guests picking avatars on their own devices.
