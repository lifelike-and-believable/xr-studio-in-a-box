---
id: story-show-safety-show-level-fallback
status: approved
derived-from:
  - epic-show-safety#outcome: f4a6fa9d5258
  - persona-show-operator#goals: 408315e4f8f6
---

# Declare and rehearse what continues if a whole layer is lost

As Alex, the show operator, I want the show to declare what carries on if it loses a whole layer or link, and to rehearse it, so that I can recover from anything without stopping the show.

## Acceptance criteria

- Alex, or the director or their delegate, writes a plan in production mode that declares, for each layer or link the show depends on, such as a remote studio, a performer, an audience system, an AR layer or an external system, what continues and what stands in: a declared recording, loop or alternative scene. A layer is lost when every input or link it uses has dropped (story-handover-and-fallback-automatic-switch).
- When a layer is lost, the rest of the show carries on and its stand-in takes over, by itself or when a person at the show starts it, as the plan says. Alex is told in text and with a sound which layer is lost and what stands in, and affected performers get the performer signal's fallback pattern (story-handover-and-fallback-performer-signal).
- A recording of a performer can stand in for them only if their agreement allows standing in (story-session-recording-record-agreement). Otherwise it is refused, and the plan shows why.
- The plan says whether and how guests are told, such as a message on the outputs, as the director or their delegate chooses.
- Each loss in the plan is rehearsed by disconnecting that layer or link, or a simulation of it for layers that arrive later, and the result is recorded. The director or their delegate approves the plan, including the choice about guests, with the cue list at the cue list gate (story-cue-list-build-a-cue-list). An agent can draft the plan but cannot approve it.
- Stand-ins work with every agent disconnected, and with no internet, except where the plan itself replaces a link that needs it.
