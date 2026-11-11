---
id: story-cue-list-timecode-and-music
status: approved
derived-from:
  - epic-cue-list#outcome: 26d12b7b12dc
  - persona-show-operator#goals: 408315e4f8f6
---

# Fire cues from timecode or a music track

As Alex, the show operator, I want cues to fire at set times on timecode or in a music track so that I can run a show from timecode, or from a mix of timecode and the cue list.

## Acceptance criteria

- Alex can give a cue (story-cue-list-build-a-cue-list) a time on a clock, and the cue fires when the clock reaches it. The clock is one the show names: the show's own clock, a music track playing in Unreal, or timecode received from outside (story-external-systems-video-and-timecode).
- A cue fires within the show's cue timing (story-cue-list-step-and-palette) of its time, measured against recorded timecode and a music track.
- For each show, Alex chooses what happens if received timecode stops: timed cues hold, or the show's own clock carries on for a time Alex sets. If timecode stops or jumps, Alex is told in plain words and by a sound, and cues skipped by a jump are listed and not fired.
- Timed cues and stepped or palette cues can be mixed in one show.
- Timed cues work with every agent and the internet disconnected, and can be tested with recorded timecode when no source is present.
