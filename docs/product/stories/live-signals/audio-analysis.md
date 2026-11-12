---
id: story-live-signals-audio-analysis
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-sound-designer#goals: 70f155e30dc6
---

# Drive a channel from live audio analysis

As Drew, the sound designer, I want to drive a channel from live audio analysis, such as level or beat, and tune it during rehearsal so that I can adjust how the sound shapes the picture in rehearsal and keep the result without waiting for a new build.

## Acceptance criteria

- Drew can choose an audio input, such as a venue feed, a microphone or a recorded file played in real time, and see its level, its beat and the level in frequency bands Drew chooses, updating live.
- Drew can drive a channel of a proxy character, such as its effects and materials channel, from any of these values through a signal mapping (story-live-signals-map-a-signal), with no code.
- The signal delay is the time from a signal reaching its input to the change appearing in the rendered picture. A person with the director's role, or their delegate, sets each show's target for it, and an agent cannot. The delay is measured with a test signal and shown, beside the target, to the people setting up the signal, with a mark when it is over the target. Other live-signals stories use this meaning.
- During rehearsal in production mode, Drew can change the analysis settings and the mapping and see the result with no new build or restart. The change is kept as a new version of the mapping, which runs in show mode only once approved (story-live-signals-map-a-signal).
- With every agent and the internet disconnected, the audio keeps driving the channel.
- An input that carries a performer's voice, such as their microphone, is performer capture. As in story-shared-characters-parameter-mapping, it drives a channel only once that performer's agreement is confirmed (story-session-recording-record-agreement) and allows it. Otherwise it is refused, and the person setting it up is told which part of the agreement blocks it.
- A microphone placed to pick up guests, such as a room or audience microphone for applause, passes on only the analysed values. Its audio is never recorded, stored, transcribed or sent to any output, and after a session none is found in the project or its recordings. It cannot be switched on for a show with guests until its notice to guests is recorded, with content defined by REQ-governance-7 and approved by a person who holds the audience-facing safety and consent approval, never an agent. Until that person records that the legal review of sensing (REQ-governance-7) is done for the show's region, it is used only in tests with crew who know about it. A performer's own microphone is covered by the criterion above and story-live-puppet-microphone-setup.
