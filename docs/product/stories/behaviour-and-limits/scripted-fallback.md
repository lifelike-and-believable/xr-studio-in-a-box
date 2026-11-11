---
id: story-behaviour-and-limits-scripted-fallback
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-show-operator#goals: 408315e4f8f6
---

# Give every behaviour a scripted fallback that runs offline

As Alex, the show operator, I want every autonomous behaviour to switch to a scripted fallback that runs with no agent or internet so that I can recover from anything without stopping the show.

## Acceptance criteria

- A scripted fallback is a fixed behaviour named in the behaviour specification (story-behaviour-and-limits-write-specification), such as a loop, a hand-made or recorded sequence, or a hold, that plays the same way on every run and needs no AI service, agent or internet. A recording of a performer can be one only if their agreement allows standing in (story-session-recording-record-agreement). This story defines a scripted fallback. Other stories refer to it by this story's id. A fallback for a performer's channel stays as in story-handover-and-fallback-define-fallback.
- A behaviour switches to its scripted fallback by itself when its method is slow, past a response time the director or their delegate sets in the specification, unavailable, switched off by an operator or by the performer's AI switch (epic-crowds-and-creatures), past its spend limit (story-agent-work-spend-limit), or when its output is outside the content limits (story-behaviour-and-limits-content-limits). The switch shows no visible jump (story-handover-and-fallback-hand-over-a-channel).
- Each switch is logged with the time, character, behaviour and cause. Alex is told in text and with a sound, not by colour alone. The behaviour comes back from its fallback only when a person at the show or a cue returns it, or at the point the specification sets.
- The fallback is approved with the specification at its gate. In show mode, only the approved fallback runs.
- A scripted test runs a test show with crowds and creatures in show mode (story-show-safety-switch-modes) from a recorded performer take (story-session-recording-record-and-replay), disconnects every AI service, agent and the internet part way through, and checks that the show carries on unchanged on its fallbacks, with no stop or restart. The test runs on the budget file's test device (story-asset-checks-check-against-budget) and with every build's automatic checks (story-build-and-install-automatic-checks).
