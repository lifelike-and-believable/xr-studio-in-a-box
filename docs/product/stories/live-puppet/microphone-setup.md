---
id: story-live-puppet-microphone-setup
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Set up a performer's microphone as a source

As Casey, the capture crew, I want a guided setup for a performer's microphone, wired or on a radio pack, through the common interface so that I can get the voice channel's source set up and checked through a guided process.

## Acceptance criteria

- Casey connects a performer's microphone through the common interface (story-live-puppet-connect-a-source) and can assign it to a character's voice channel (story-live-puppet-assign-channels), with no code. Like any capture source, it is refused for a performer whose confirmed agreement (story-session-recording-record-agreement) does not allow their voice to be captured, and Casey is told which part blocks it.
- A guided level check asks the performer to speak and to shout at show volume, told both by voice and on a screen. Casey sees the level against a target range that Casey sets, or Drew for the show's mix, and is told in plain words to raise or lower the gain, and the setting is saved under the performer's name.
- A lost radio link, or a microphone that stops sending, is a drop (story-handover-and-fallback-automatic-switch). The voice channel uses its fallback (story-handover-and-fallback-define-fallback), and Casey is told in text and with a sound. Casey can tell a drop apart from the performer being silent, and silence alone is never a drop.
- The delay from the microphone to each output is measured and shown against the show's delay target (story-live-puppet-measure-delay).
- The story is tested with a wired microphone and one radio pack switched off mid-take, with a recorded voice as a simulated source, and works with every agent and the internet disconnected.
