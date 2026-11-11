---
id: story-handover-and-fallback-automatic-switch
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-performer#goals: 9de25c7bbe59
---

# Switch to the fallback when an input drops

As Kai, the performer, I want each affected channel to switch to its fallback by itself when an input drops so that I can stay in character whatever happens.

## Acceptance criteria

- An input is a capture source or a live signal. An input has dropped when it disconnects, reports a device failure, sends values that are not valid for it, or sends no value for longer than a timeout set for that input. Casey sets each timeout, and an agent cannot change it in show mode. Other stories use this meaning of drop.
- When an input drops, for example when Casey unplugs or switches off the device in rehearsal, each channel and scene value it drives switches to its fallback (story-handover-and-fallback-define-fallback). The show does not stop, no system restarts, and there is no visible jump (story-handover-and-fallback-hand-over-a-channel).
- If the chosen fallback cannot be used when the input drops, because it is missing, has also dropped, or is no longer allowed by the performer's agreement, the channel uses a safe hold instead, and Casey is told in text and with a sound.
- The time from a drop to the fallback taking effect is measured and shown for each capture source. The first device-failure tests run in this story, with a real performer and each source epic-live-puppet has delivered on real hardware, the portable inertial suit first. Until a studio is booked, the optical studio stream is tested with a simulated failure, and its target is set at the first studio test. Casey and the performer set each target time from the results before the story is accepted, and later tests show a pass or fail against it in text, not by colour alone.
- The switch works with no agent and no internet.
- Each switch is logged with the time, character, channel, input and fallback, and Casey is told in the crew's tools in text and with a sound, not by colour alone.
