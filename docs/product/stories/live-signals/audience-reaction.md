---
id: story-live-signals-audience-reaction
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-performer#goals: 9de25c7bbe59
---

# Drive the scene from the audience's combined reaction

As Kai, the performer, I want the audience's combined reaction to drive effects, materials and scene values so that I can sense the audience through the world around me without watching hundreds of avatars.

## Acceptance criteria

- The audience's combined reaction from the audience summary (REQ-audience-6; story-audience-voice-audience-summary), made from the reactions guests send (story-audience-avatars-react), can drive effects, materials and scene values through a signal mapping (story-live-signals-map-a-signal).
- Until story-audience-voice-audience-summary is built, the story is tested against a simulated audience whose size and reaction a person sets.
- Only combined values reach the mapping. No value identifies or follows a single guest, and no reaction value is stored or recorded (story-session-recording-record-and-replay).
- Kai can sense the result by more than sight alone: the same reaction can drive a sound value as well as a visual one.
- If the reaction signal drops (story-handover-and-fallback-automatic-switch), the channels and scene values it drives use their fallback (story-handover-and-fallback-define-fallback).
