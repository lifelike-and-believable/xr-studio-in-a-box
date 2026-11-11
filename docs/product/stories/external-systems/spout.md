---
id: story-external-systems-spout
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Exchange video through Spout

As Sam, the technical artist, I want to send and receive video through Spout, as well as NDI, so that I can add media servers on the show machine as integrations without modifying the core.

## Acceptance criteria

- Sam can send an output of the show, and show an incoming stream in the world or on an output, through Spout with another application on the same show machine. Sam sets each one up without code and in production mode (story-show-safety-switch-modes), in the same way as NDI (story-external-systems-video-and-timecode). Spout works only on Windows, and on other systems the setup says so in plain words.
- If an incoming Spout stream drops (story-handover-and-fallback-automatic-switch), it is replaced by the image Sam sets, and Alex is told in plain words and by a sound, as for NDI (story-external-systems-video-and-timecode). If the receiver of an outgoing stream disconnects, Alex is told in the same way, and the rest of the show carries on.
- Spout runs on the show machine with no network and no internet. SRT and SDI follow in a later story (epic-external-systems).
- The delay of a Spout stream, each way, is measured and shown, with the frame rate and resolution in use.
- The story is tested against recorded Spout streams, and once in rehearsal with a real media server application on the show machine, which Sam chooses with the director or their delegate before the story is accepted. It works with every agent and the internet disconnected.
- In show mode, only a person whose role allows it changes these settings, following the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change them.
