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
- The signal delay is the time from a signal reaching its input to the change appearing in the rendered picture. A person with the right role sets each show's target for it, and an agent cannot. The delay is measured with a test signal and shown, beside the target, to the people setting up the signal, with a mark when it is over the target. Other live-signals stories use this meaning.
- During rehearsal, Drew can change the analysis settings and the mapping and see the result with no new build or restart. The change is kept as a new version of the mapping.
- With every agent and the internet disconnected, the audio keeps driving the channel.
