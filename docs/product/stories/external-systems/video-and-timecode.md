---
id: story-external-systems-video-and-timecode
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Exchange video and timecode with other systems

As Sam, the technical artist, I want to send and receive video through NDI, Spout, SRT and SDI, and timecode, so that I can add media servers and timecode sources as integrations without modifying the core.

## Acceptance criteria

- Sam can send an output of the show as an NDI, Spout, SRT or SDI stream, and show an incoming stream in the world or on an output, without code and in production mode. SDI needs a card in the show machine, and is tested on a card the project names.
- The show can receive timecode, as LTC or MIDI timecode, as a clock for timed cues (story-cue-list-timecode-and-music), and can send timecode so other systems follow it.
- If an incoming stream or timecode drops (story-handover-and-fallback-automatic-switch), a stream is replaced by an image Sam sets, and Alex is told in plain words and by a sound. What timed cues do is set in story-cue-list-timecode-and-music.
- The delay of each kind of stream, each way, is measured and shown.
- The story is tested against recorded or simulated streams and timecode (story-external-systems-simulators), and works on the venue network with every agent and the internet disconnected. In show mode an agent cannot change these settings.
