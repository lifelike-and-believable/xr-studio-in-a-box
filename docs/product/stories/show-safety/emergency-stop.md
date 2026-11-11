---
id: story-show-safety-emergency-stop
status: approved
derived-from:
  - epic-show-safety#outcome: f4a6fa9d5258
  - persona-show-operator#goals: 408315e4f8f6
---

# Reach the safe state with one control

As Alex, the show operator, I want one physical control, and the venue's fire alarm, to put the whole show into its safe state so that I can reach a safe state with one control, with no agent or internet needed.

## Acceptance criteria

- One control puts every output of the session into its safe state (story-show-safety-declare-safe-state), and no cue fires until the stop is cleared. The control is a wired or local physical button, with a matching control on the operator console. A performer's gesture is not offered as an emergency stop until tests show it is reliable.
- A venue's fire alarm can trigger the same stop through an input. It is tested with a simulated alarm signal, and with a venue's alarm interface in rehearsal once a venue is booked.
- The stop works with every agent and the internet disconnected, and this is tested.
- The button's reliability is tested in rehearsal: it is pressed at moments across a full run, a number of times that the holder of the audience-facing safety and consent approval sets, and reaches the safe state every time. The time from press to safe state on each output is measured, and that holder sets the target from the results before this story is accepted. Later tests show pass or fail against it in text.
- When the stop fires, the cast and crew named for the session are told on the crew channel (story-performer-support-crew-channel), as text and read aloud, and each performer also gets a signal in at least two senses, with a pattern distinct from the performer signal (story-handover-and-fallback-performer-signal).
- Only a person at the show whose role allows it, such as Alex, or the performer on a show declared solo (story-show-safety-solo-show), can clear the stop, with a control that asks them to confirm. The show then carries on from a cue they choose (story-session-operations-pause-and-jump). An agent cannot fire or clear the stop. Each stop and clear is logged with what fired it, who cleared it and when.
