---
id: epic-live-signals
status: approved
derived-from:
  - requirements-performance#REQ-performance-13: 0b9a832893fa
  - requirements-performance#REQ-performance-19: a7c23a111e38
  - persona-performer#goals: 9de25c7bbe59
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-sound-designer#goals: 70f155e30dc6
  - persona-capture-crew#goals: a63bac7ade3c
---

# Music, sensors and the crowd drive the show

<!-- Layer 2, live puppetry. -->

## Outcome

A live signal that is not capture, such as music, a controller, the audience's combined reaction or a sensed guest presence, can continuously drive a channel, with the same mapping and fallback as a capture source.

## Personas

- persona-performer: can play with music, a sensor or the crowd as part of a character.
- persona-technical-artist: connects signals and builds mappings, without code.
- persona-sound-designer: lets sound shape what the audience sees.
- persona-capture-crew: sets up and calibrates presence sensors.

## Proposed stories

- Drive a channel from live audio analysis, such as level or beat.
- Drive a channel from MIDI, OSC or DMX.
- Map a signal onto a channel, and save the mapping as a reviewable asset.
- Drive a channel from a performer's sensor, within their agreement.
- Drive effects, materials and scene values from the audience's combined reaction.
- Report guest presence from floor pads, beams or depth sensors, with a simulated crowd for testing and rehearsal.
- Use a channel's fallback when a signal drops.

## Stories

- story-live-signals-audio-analysis
- story-live-signals-midi-osc-dmx
- story-live-signals-map-a-signal
- story-live-signals-performer-sensor
- story-live-signals-audience-reaction
- story-live-signals-guest-presence
- story-live-signals-signal-fallback

## Release groups

- Audio analysis, the mapping and the fallback ship together: this is the smallest proof that a signal behaves like a source.
- MIDI, OSC and DMX can then ship on their own.
- Sensors ship after the performer's agreement exists.
- Audience reaction ships after the audience summary exists, and is tested against a simulated audience until then.
- Guest presence can ship on its own, tested against a simulated crowd.

## Dependencies

- epic-live-puppet, for channels and the common interface.
- epic-handover-and-fallback, for fallbacks.
- epic-session-recording, for the performer's agreement.
- The audience layer, for the combined reaction (REQ-audience-6).
- The legal review of sensing (REQ-governance-7), before a public show uses guest presence.

## Open questions

- Answered: audio analysis comes first (approver's answer), because the concert case needs it and it needs no extra hardware.
- Answered: each show sets its own target for the delay from signal to picture, and the delay is measured and shown against it. Settled in story-live-signals-audio-analysis, which defines the signal delay.
- Answered: a signal mapping is the same kind of asset as a body mapping (story-shared-characters-map-a-different-body), so the same review and versioning apply. See story-live-signals-map-a-signal. This is a proposal for the approver to confirm.

## Out of scope

- Firing cues from signals, which belongs to the show control layer.
- Characters reacting to identified guests (REQ-characters-9), which is later.
- Autonomous characters reacting to presence (REQ-characters-12), which belongs to the AI layer and uses this signal.
