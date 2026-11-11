---
id: story-sound-path-live-voice-processing
status: approved
derived-from:
  - epic-sound-path#outcome: 3f3e81a83f45
  - persona-performer#goals: 9de25c7bbe59
---

# Process a live voice within the performer's agreement

As Kai, the performer, I want my live voice processed for a character only as my agreement allows so that I decide how my voice may be used, including any AI use.

## Acceptance criteria

- Drew can set real-time processing for a performer's live voice in Unreal, such as pitch, filters and effects, without code, and hear the result.
- Processing runs only if Kai's confirmed agreement allows the use it needs (story-session-recording-record-agreement): driving a character live for plain processing, and transformation for AI voice transformation. Otherwise it does not run. Drew sees which part of the agreement blocks it, and the show's operator and Kai are told in text and with a sound.
- AI voice transformation arrives with Layer 7. In this story, the agreement check is tested with a request for it, which is refused or allowed as the agreement says.
- The delay the processing adds is measured with a test signal and shown beside a target that a person with the director's role, or their delegate, sets. An agent cannot set it.
- Processing settings are versioned. Drew can change them in rehearsal in production mode, and a new version runs in show mode only once the person named for the sound and music gate accepts it. An agent cannot change them in show mode.
- The processing runs with every agent and the internet disconnected.
