---
id: story-show-safety-solo-show
status: approved
derived-from:
  - epic-show-safety#outcome: f4a6fa9d5258
  - persona-performer#goals: 9de25c7bbe59
---

# Run a solo show with controls that cannot be disarmed

As Kai, the performer, I want emergency stop, pause and handover as controls I can use while performing, which nobody can disarm, so that I can run a public show alone and stay in character whatever happens.

## Acceptance criteria

- A show is declared solo when it runs sessions with guests and no separate operator. The director or their delegate makes the declaration in production mode (story-show-safety-switch-modes), and it is recorded with who made it. An agent cannot make or change it. This story defines the solo declaration. Other stories refer to it by this story's id.
- In a show declared solo, Kai has three controls that work while performing, without a screen or keyboard: the emergency stop (story-show-safety-emergency-stop), hold and resume (story-session-operations-pause-and-jump), and a set handover (story-handover-and-fallback-trigger-handover). The emergency stop is a wired or local physical button within Kai's reach while performing. None of the three can be disarmed, by section (story-cue-list-performer-fired) or in any other way.
- Kai perceives that each control has acted in at least two senses, with a pattern for each that is distinct from the others and from the performer signal (story-handover-and-fallback-performer-signal).
- Each control is tested in rehearsal with Kai performing: it acts every time over a number of uses that the holder of the audience-facing safety and consent approval sets, and does not fire by accident during a full run. Kai and that holder set the bar before this story is accepted.
- Guest moderation and safety run on rules set before the show (REQ-audience-8, REQ-audience-11), approved by that holder. Wherever the cue list or a story needs an operator, the show must name a performer control or a rule that covers it. A solo show cannot start a session with guests in show mode while any such action is uncovered, and the check lists each one in plain words.
- Until the audience layer exists, guest rules are tested with simulated guests. The controls work with every agent and the internet disconnected.
