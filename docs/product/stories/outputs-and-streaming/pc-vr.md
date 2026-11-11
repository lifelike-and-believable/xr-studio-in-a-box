---
id: story-outputs-and-streaming-pc-vr
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Output to PC VR, including wireless PC VR

As Sam, the technical artist, I want the show to output to PC VR headsets, wired or wireless, with the engine and plugin versions each one uses recorded, so that I can keep engine and plugin versions under control across targets.

## Acceptance criteria

- The same live performance reaches one or more PC VR headsets at once, alongside the show's other outputs (REQ-delivery-3). Wireless PC VR, which streams from a PC, counts as PC VR (REQ-delivery-9). Sam sets up each headset output without code and in production mode (story-show-safety-switch-modes). The headsets checked are the test devices named in the PC VR budget file (story-asset-checks-check-against-budget).
- The engine and plugin versions the PC VR output uses are recorded with each build, and differences from other targets are shown (story-build-and-install-engine-and-plugin-versions).
- On each test headset, wired and wireless, frame rate is measured against the budget file, and the delay from a performer's movement to the headset image is measured as in story-live-puppet-measure-delay. The extra delay of the wireless link is shown separately. The sound-to-picture offset in each headset is measured and shown beside the show's target (story-sound-path-mix-per-output).
- After an emergency stop (story-show-safety-emergency-stop), each headset shows the real room, or the safe view where it cannot (story-show-safety-declare-safe-state). The time from the stop to that view is measured on each test headset and shown against the stop's target.
- If a headset disconnects or its link drops, the rest of the show carries on. Alex and Taylor are told in plain words and by a sound which headset dropped, and it is marked dark on the thumbnail wall (story-session-operations-output-thumbnails).
- Headset outputs work on the venue network with every agent and the internet disconnected. In show mode, only a person whose role allows it changes their settings, following story-session-operations-live-changes. An agent cannot. The story is tested on a delivered build (story-build-and-install-build-from-stages), installed on the show machine (story-build-and-install-install-and-roll-back) on the first release's test kit (story-build-and-install-measure-against-budget), with simulated guests until the audience layer exists.
