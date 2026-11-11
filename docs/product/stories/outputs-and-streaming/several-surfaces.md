---
id: story-outputs-and-streaming-several-surfaces
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Output to several surfaces through Unreal's display tools or a media server

As Sam, the technical artist, I want to drive several projectors or surfaces through Unreal's display tools, or by sending video to a venue's media server, so that I can add multi-surface output as an integration without modifying the core.

## Acceptance criteria

- Sam can set up a show to output to several projectors or surfaces through Unreal's own multi-display tools, or by sending video to a venue's media server over NDI (story-external-systems-video-and-timecode) or Spout (story-external-systems-spout), without code and in production mode (story-show-safety-switch-modes). The pipeline does not build its own warping and blending tools.
- The geometry, mirroring and brightness of each output are saved in the venue's profile (story-venue-setup-venue-profile), and are used again when the show returns to that venue.
- The difference in frames between surfaces showing the same moment is measured and shown. The director or their delegate sets the largest difference allowed, and the result shows pass or fail against it in text.
- Before a show uses a dome or blended projection through Unreal's display tools, Sam runs a trial on a blended projection setup with the engine version the show builds with, and records the result with that version: whether warping, edge blending and alignment cover the setup, and what the director or their delegate saw at the seams. The director or their delegate accepts or rejects the picture. Where the tools do not cover it, the show sends video to the media server instead. The trial is run again when the engine version changes.
- After an emergency stop (story-show-safety-emergency-stop), every surface shows the safe view (story-show-safety-declare-safe-state), and if one output or the media server link drops, Alex is told in plain words and by a sound which one, and the rest of the show carries on.
- The outputs work on the venue network with every agent and the internet disconnected. In show mode, only a person whose role allows it changes their settings, following story-session-operations-live-changes, and stays with the session until saved to the venue profile (story-venue-setup-venue-profile). An agent cannot. The story is tested on a delivered build (story-build-and-install-build-from-stages), installed on the show machine (story-build-and-install-install-and-roll-back) with two projectors on the first release's test kit (story-build-and-install-measure-against-budget), and with a simulated media server stream (story-external-systems-video-simulators), with a recorded one until that story is built.
