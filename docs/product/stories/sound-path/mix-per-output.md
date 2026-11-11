---
id: story-sound-path-mix-per-output
status: approved
derived-from:
  - epic-sound-path#outcome: 3f3e81a83f45
  - persona-sound-designer#goals: 70f155e30dc6
---

# Set a mix for each output, in sync with picture

As Drew, the sound designer, I want to set a mix for each output, including live voices and external feeds, so that one show keeps a right-sounding mix for each output.

## Acceptance criteria

- The show mixes in Unreal, with MetaSounds and submixes, on the show machine with no extra machine. Drew can set a mix for each output the show uses, such as headsets, the stream and the browser, without code. The mix reaches each output through story-outputs-and-streaming-pc-vr, story-outputs-and-streaming-projector-or-screen and story-outputs-and-streaming-stream-to-platforms, and the browser and app through story-remote-guests-interactive-guest and story-remote-guests-player-guest. Until those stories are built, Drew can hear each mix in the Unreal Editor and record it to a file.
- A performer's live voice joins a mix only if the performer's confirmed agreement allows their voice to be captured and used to drive a character live (story-session-recording-record-agreement). If a voice is left out because the agreement does not allow it, Drew, the show's operator and the performer are told in text and with a sound. An external feed, such as a venue's mixing desk, can join a mix as an input with its own level in each output.
- A mix can change on a cue (story-cue-list-build-a-cue-list) or through a signal mapping (story-live-signals-map-a-signal). Until the cue story is built, cues are simulated in the test.
- The sound-to-picture offset is the time between a picture event and its sound at an output. It is measured at each output with a test signal, a flash and a click, and shown beside the show's target with a mark in text when it is over. On a stream, it is measured on the stream as a viewer receives it (story-outputs-and-streaming-stream-to-platforms), recorded or simulated until that story is built, so the stream's delay of seconds does not count. Other sound-path stories use this meaning.
- A person with the director's role, or their delegate, sets the show's target for the sound-to-picture offset. An agent cannot.
- The mixes keep running with every agent and the internet disconnected.
