---
id: story-live-signals-signal-fallback
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-performer#goals: 9de25c7bbe59
---

# Fall back when a signal drops

As Kai, the performer, I want a channel to use its fallback when a signal drops, and to be told so that I can stay in character and feel that something has changed without breaking the performance.

## Acceptance criteria

- A signal has dropped when its input disconnects, or when no value arrives for longer than a timeout set on its mapping. Other live-signals stories use this meaning.
- When a signal drops, each channel it drives switches to that channel's fallback automatically, in the same way as for a capture source (story-handover-and-fallback-automatic-switch), with no person or agent acting.
- Kai is told through the same performer signal as a capture-source fallback, which does not rely on sound or sight alone.
- When the signal returns, the channel goes back to it in the same way as a recovered capture source, with no visible jump.
- In rehearsal, each kind of signal is unplugged, and the time from drop to fallback is measured and shown. The target is set from those results, as for capture sources.
- This works with every agent and the internet disconnected.
