---
id: story-external-systems-video-and-timecode
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Exchange video through NDI, and LTC timecode

As Sam, the technical artist, I want to send and receive video through NDI, and receive and send LTC timecode, so that I can add media servers and timecode sources as integrations without modifying the core.

## Acceptance criteria

- Sam can send an output of the show as an NDI stream, and show an incoming NDI stream in the world or on an output, without code and in production mode.
- The show can receive LTC timecode as a clock for timed cues (story-cue-list-timecode-and-music), and can send LTC so other systems follow it.
- If an incoming stream or timecode drops (story-handover-and-fallback-automatic-switch), a stream is replaced by an image Sam sets, and Alex is told in plain words and by a sound. What timed cues do is set in story-cue-list-timecode-and-music.
- The delay of each kind of stream, each way, is measured and shown.
- The story is tested against recorded or simulated streams and timecode (story-external-systems-simulators), and works on the venue network with every agent and the internet disconnected. In show mode an agent cannot change these settings.
