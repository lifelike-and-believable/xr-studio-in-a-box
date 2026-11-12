---
id: story-live-signals-signal-fallback
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-performer#goals: 72110c93fc2a
---

# Fall back when a signal drops

As Kai, the performer, I want a channel to use its fallback when a signal drops, and to be told, so that I can stay in character and feel that something has changed without breaking the performance.

## Acceptance criteria

- A signal drops as defined in story-handover-and-fallback-automatic-switch, which treats a live signal as an input.
- When a signal drops, each channel and scene value it drives switches to its fallback (story-handover-and-fallback-define-fallback) automatically, with no person or agent acting.
- Kai gets the performer signal's fallback pattern (story-handover-and-fallback-performer-signal), which does not rely on sound or sight alone.
- When the signal returns, the channel goes back to it in the same way as a recovered capture source (story-handover-and-fallback-return-recovered-source), with no visible jump.
- In rehearsal, each kind of signal is unplugged, and the time from drop to fallback is measured and shown. Casey and the performer set the target from those results, as for capture sources.
- This works with every agent and the internet disconnected.
