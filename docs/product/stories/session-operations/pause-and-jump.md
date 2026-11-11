---
id: story-session-operations-pause-and-jump
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-show-operator#goals: 408315e4f8f6
---

# Pause and resume, and jump to any cue on any path

As Alex, the show operator, I want to hold the show and carry on from the same place, and to jump to any cue with the world in the right state, so that I can recover from anything by pausing or jumping to a cue, and rehearse cue to cue when performers are absent.

## Acceptance criteria

- Alex can hold the show with one control. While it is held, no cue fires (story-cue-list-build-a-cue-list), and cue waits, timed cues and the show's own clock stop. Live performers keep driving their characters. When Alex resumes, the show carries on from the same cue, with the time left on each wait. While held, a show that follows received timecode or a leading external system (story-external-systems-lead-or-follow) stops following it. On resume, Alex chooses to rejoin at the current timecode or the leading system's current cue, or to carry on from the held cue on the show's own clock. Cues passed while held are listed and not fired.
- Alex can jump forward or back to any cue on any path (epic-branching-shows). The world is then in the state that cue expects: scene, lighting, sound, character forms and outputs. Where earlier branches change that state, Alex chooses which path the world reflects. A scripted test jumps to every cue of a test show and checks the state against a run from the start along the same path.
- For cue-to-cue rehearsal with no performer present, a recording (story-session-recording-record-and-replay) can drive a performer's characters from the cue Alex jumps to, only if that performer's agreement allows replay in rehearsal (story-session-recording-record-agreement).
- When the show is held, resumed or jumped, the cast and crew named for the session are told on the crew channel (story-performer-support-crew-channel), as text and read aloud.
- In show mode (story-show-safety-switch-modes), only a person at the show whose role allows it, such as Alex, can hold, resume or jump, and each one is logged with who did it and when. On a show declared solo, the performer holds and resumes through their own controls (story-show-safety-solo-show). In a self-guided show (story-branching-shows-self-guided-run), the guest can hold and resume their own session. When the show follows a system that sends MIDI show control, a stop or resume from an allowed sender (story-external-systems-osc-midi-msc) holds or resumes the show. An agent cannot hold, resume or jump in show mode.
- Hold, resume and jump work with every agent and the internet disconnected.
