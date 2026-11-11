---
id: story-outputs-and-streaming-projector-or-screen
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-show-operator#goals: 408315e4f8f6
---

# Output to a projector or screen

As Alex, the show operator, I want the show to output to a projector or screen, and to see that output checked before the show, so that I know before doors open that the outputs are ready.

## Acceptance criteria

- Sam can set up an output to a projector or screen connected to the show machine, with the view it shows, its resolution, frame rate, mirroring and orientation, without code and in production mode (story-show-safety-switch-modes). The settings are saved in the venue's profile (story-venue-setup-venue-profile).
- The pre-show check (story-session-operations-pre-show-check) confirms each projector and screen output is connected and showing a picture, and the thumbnail wall (story-session-operations-output-thumbnails) shows each one by name.
- The delay from a performer's movement to each projector or screen is measured as in story-live-puppet-measure-delay, and the sound-to-picture offset at it is measured with a test signal and shown beside the show's target (story-sound-path-mix-per-output).
- After an emergency stop (story-show-safety-emergency-stop), each projector and screen shows the safe view (story-show-safety-declare-safe-state). The time from the stop to the safe view is measured and shown against the stop's target.
- If a projector or screen disconnects, the rest of the show carries on, and Alex is told in plain words and by a sound which output dropped, with what to do next.
- The outputs work on the venue network with every agent and the internet disconnected. In show mode, only a person whose role allows it changes their settings, following story-session-operations-live-changes. An agent cannot. The story is tested on a delivered build (story-build-and-install-build-from-stages), installed on the show machine (story-build-and-install-install-and-roll-back) on the first release's projection kit.
