---
id: story-behaviour-and-limits-scripted-fallback
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Give every behaviour a scripted fallback that runs offline

As Sam, the technical artist, I want every autonomous behaviour to switch to a scripted fallback that runs with no agent or internet so that the show keeps running when agents and the internet are gone.

## Acceptance criteria

- A scripted fallback is a fixed behaviour named in the behaviour specification (story-behaviour-and-limits-write-specification), such as a loop, a hand-made or recorded sequence, or a hold, that plays the same way on every run and needs no AI service, agent or internet. A recording of a performer can be one only if their agreement allows standing in (story-session-recording-record-agreement). This story defines a scripted fallback. Other stories refer to it by this story's id. A fallback for a performer's channel stays as in story-handover-and-fallback-define-fallback.
- A behaviour switches to its scripted fallback by itself when its method is slow, past a response time the director or their delegate sets in the specification, unavailable, switched off by an operator, past its spend limit (story-agent-work-spend-limit), or when its output is outside the content limits (story-behaviour-and-limits-content-limits). The switch shows no visible jump (story-handover-and-fallback-hand-over-a-channel), except on a limits breach, when the output is withheld or covered at once. What an assist on a performer's character does when the performer's AI switch turns it off is set in story-crowds-and-creatures-ai-assists.
- Each switch is logged with the time, character, behaviour and cause. Alex is told in text and with a sound, not by colour alone. The behaviour comes back from its fallback only when a person at the show or a cue returns it, or at the point the specification sets. An assist on a performer's character comes back only when that performer switches AI on (story-crowds-and-creatures-ai-assists).
- The fallback is approved with the specification at its gate. In show mode, only the approved fallback runs.
- A scripted test runs a test show with proxy autonomous characters, and with crowds and autonomous creatures once those stories are built, in show mode (story-show-safety-switch-modes) from a recorded performer take (story-session-recording-record-and-replay), disconnects every AI service, agent and the internet part way through, and checks that the show carries on unchanged on its fallbacks, with no stop or restart. Further cases trigger each other cause in turn: a slow method, an unavailable method, an operator switch-off, the spend limit and a limits breach. The test runs on the budget file's test device (story-asset-checks-check-against-budget) and with every build's automatic checks (story-build-and-install-automatic-checks).
