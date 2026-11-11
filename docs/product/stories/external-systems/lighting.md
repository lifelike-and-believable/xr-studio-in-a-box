---
id: story-external-systems-lighting
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Connect lighting through DMX and PosiStageNet

As Sam, the technical artist, I want cues to send and receive DMX over Art-Net or sACN, and positions over PosiStageNet, so that I can add lighting as an integration without modifying the core.

## Acceptance criteria

- A cue (story-cue-list-build-a-cue-list) can send DMX values over Art-Net or sACN to fixtures or a lighting desk. Sam patches universes and channels without code, in production mode.
- An incoming DMX channel can fire a cue when it crosses a level Sam sets, as well as driving a channel (story-live-signals-dmx).
- The show can send the positions of characters, cameras and tracked objects over PosiStageNet, so lights can follow them, and can receive positions over PosiStageNet from a tracking system.
- DMX the show sends goes to the values the show's safe state sets when the safe state is reached (story-show-safety-safe-state).
- The delay for DMX and PosiStageNet, each way, is measured and shown against the show's cue timing (story-cue-list-step-and-palette).
- The story is tested against simulated Art-Net, sACN and PosiStageNet (story-external-systems-simulators), and in rehearsal with a real fixture or desk. It works with every agent and the internet disconnected. In show mode an agent cannot change the patch.
