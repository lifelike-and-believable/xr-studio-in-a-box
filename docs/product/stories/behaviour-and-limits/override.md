---
id: story-behaviour-and-limits-override
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-show-operator#goals: 408315e4f8f6
---

# Pause, redirect or take over an autonomous character

As Alex, the show operator, I want to pause, redirect or take over any autonomous character at any time from the show tools so that I can recover from anything by pausing or changing who drives a character.

## Acceptance criteria

- This story defines an override: pausing, redirecting, taking over and handing back an autonomous character. Other stories refer to it by this story's id. From the operator console, Alex can pause, redirect or take over one autonomous character (story-behaviour-and-limits-write-specification), a crowd or group as one, or every autonomous character with one control. Paused, a character stops acting on its behaviour and holds its pose and place until Alex resumes it. Redirecting sends it to another behaviour or target its accepted specification lists, such as a place, a state or following a performer. Redirect to anything outside the specification is not offered.
- Taking over hands the character to a person: Alex drives it from a control the show sets up, or it goes to a performer's capture source, only once that performer's agreement allows driving a character live (story-session-recording-record-agreement), using a handover method with no visible jump (story-handover-and-fallback-hand-over-a-channel). Alex can hand it back to its behaviour the same way, except an assist the performer's AI switch turned off, which only that performer can switch back on (story-crowds-and-creatures-ai-assists). Pause, redirect, take over and hand back are operations, not changes during a live run (story-session-operations-live-changes).
- Each one takes effect within a time the director or their delegate sets from rehearsal, before the story is accepted. In rehearsal, Alex takes over an autonomous character with no show stop.
- In show mode (story-show-safety-switch-modes), only a person at the show whose role allows it, such as Alex or the director or their delegate, or a cue, can override. An agent cannot. Each override is logged with who or what made it and when, and the cast and crew named for the session are told on the crew channel (story-performer-support-crew-channel), as text and read aloud. On a show declared solo (story-show-safety-solo-show), overrides the cue list needs are covered by a performer control or a rule, as that story requires.
- Overrides work with every agent and the internet disconnected, and are tested on proxy characters in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget).
