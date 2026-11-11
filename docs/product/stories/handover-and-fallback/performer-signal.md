---
id: story-handover-and-fallback-performer-signal
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-performer#goals: 9de25c7bbe59
---

# Tell the performer about a fallback

As Kai, the performer, I want a signal I can perceive while performing when a channel falls back or recovers so that I can feel a problem without breaking the performance.

## Acceptance criteria

- When a channel switches to its fallback, Kai gets the performer signal. It does not rely on sound or sight alone: it uses at least two senses, such as touch and sound, or touch and light.
- The performer signal has a distinct pattern for each of these events, and Kai can tell them apart while performing: a channel has fallen back after an input dropped, including a capture source, a live signal or a remote link; a channel has recovered; a handover Kai triggered is done; a channel has fallen below its legibility bar; the audience summary has stopped arriving. The test in this story covers each one.
- The signal goes only to the performer or performers who own the affected channel (story-shared-characters-split-a-character), not to others on stage.
- The signal reaches no audience output, and guests cannot see or hear it.
- The signal for a performer in a headset, and for one in a suit with no headset, is chosen in a test with a real performer in each setup. Each performer sets the bar for noticing it while performing before the story is accepted, and the bar is still met with the sound part removed and with the sight part removed.
- The signal works with no agent and no internet.
