---
id: story-external-systems-osc-midi-msc
status: approved
derived-from:
  - epic-external-systems#outcome: 8ae607deb0f3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Fire and send cues through OSC, MIDI and MIDI show control

As Sam, the technical artist, I want incoming OSC, MIDI and MIDI show control messages to fire cues, and cues to send them, so that I can add a venue's cue and lighting systems as integrations without modifying the core.

## Acceptance criteria

- Sam can set, without code and in production mode, which incoming OSC address, MIDI note or controller, or MIDI show control command (such as go, stop or resume, with a cue number and list) fires which cue (story-cue-list-build-a-cue-list) or the next go. When the show follows that system, a stop or resume from an allowed sender holds or resumes the show (story-session-operations-pause-and-jump). Receiving OSC and MIDI is set up as in story-live-signals-osc and story-live-signals-midi.
- A cue can send OSC, MIDI and MIDI show control messages, so the show can lead other systems. A show can also send a one-way message, such as a venue ready signal, over OSC or MIDI to a receiver Sam names.
- Sam names the senders allowed to fire cues, by network address or device. Messages from any other sender fire nothing and are logged, so a stray message on the venue network cannot fire a cue.
- A cue fired by an incoming message fires within the show's cue timing (story-cue-list-step-and-palette), measured from the moment the message arrives. The delay from the sender to its arrival is measured and shown on its own.
- In show mode, only a person whose role allows it changes these settings, following the rules for changes during a live run (story-session-operations-live-changes). An agent cannot change them. Messages fire cues with every agent and the internet disconnected.
- The story is tested against simulated messages (story-external-systems-simulators), and once in rehearsal with a real lighting desk firing cues over OSC or MIDI show control. The project chooses the desk before the story is accepted.
