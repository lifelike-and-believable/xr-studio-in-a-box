---
id: story-outputs-and-streaming-stream-to-platforms
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Send a flat livestream to a public platform, the show's player page, or both

As Sam, the technical artist, I want to send the show's flat livestream to YouTube Live, to the show's own player page, or to both, with each destination added as an integration, so that I can add or change a streaming platform without modifying the core.

## Acceptance criteria

- The flat livestream is a picture and sound output of the show: a view the director or their delegate chooses, such as virtual cameras cut by cue (REQ-showcontrol-2), with the stream's mix (story-sound-path-mix-per-output). A stream destination is a place the livestream is sent. The first public platform is YouTube Live, alongside the show's own player page. This story defines the flat livestream and a stream destination. Other stories refer to them by this story's id.
- Sam sets the destinations of a show, YouTube Live, the player page or both, without code and in production mode (story-show-safety-switch-modes). Each destination is an integration behind one interface, so another platform can be added without changing the show or the other destinations. Going live on a public platform needs approval (story-outputs-and-streaming-approve-going-live).
- The delay from a performer's movement to the stream as a viewer receives it is measured on each destination and shown, as in story-live-puppet-measure-delay, with the stream's seconds of delay shown separately from the show's delay target. The sound-to-picture offset (story-sound-path-mix-per-output) is measured on the stream as a viewer receives it and shown beside the show's target.
- After an emergency stop (story-show-safety-emergency-stop), every destination shows the holding screen of the safe state (story-show-safety-declare-safe-state). The time from the stop to the holding screen, as a viewer receives it, is measured and shown against the stop's target.
- If a destination or the internet drops (story-handover-and-fallback-automatic-switch), the show carries on in the venue and the other destinations keep running (REQ-delivery-5, REQ-audience-15). Alex is told in plain words and by a sound which destination dropped. Only the livestream needs the internet: every other output keeps running with every agent and the internet disconnected.
- In show mode, only a person whose role allows it, such as Alex, starts or stops a destination, and changes to destinations follow story-session-operations-live-changes. An agent cannot. The story is tested on a delivered build (story-build-and-install-build-from-stages), installed on the show machine (story-build-and-install-install-and-roll-back) with a private YouTube Live stream that only the crew can see and the player page on a test network, with simulated viewers until the audience layer exists.
