---
id: story-handover-and-fallback-automatic-switch
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-performer#goals: 9de25c7bbe59
---

# Switch to the fallback when a source drops

As Kai, the performer, I want each affected channel to switch to its fallback by itself when a source drops so that I can stay in character whatever happens.

## Acceptance criteria

- A source has dropped when it sends no valid data for longer than a timeout set for that source, or reports a device failure.
- When a source drops, for example when Casey unplugs or switches off the device in rehearsal, each channel it drives switches to its fallback (story-handover-and-fallback-define-fallback). The show does not stop, no system restarts, and there is no visible jump (story-handover-and-fallback-hand-over-a-channel).
- The time from a drop to the fallback taking effect is measured and shown for each capture source. The first device-failure tests run in this story, with a real performer and each source epic-live-puppet has delivered, the portable inertial suit first. Casey and the performer set the target time from those results before the story is accepted, and later tests show a pass or fail against it in text, not by colour alone.
- The switch works with no agent and no internet.
- Each switch is logged with the time, character, channel, source and fallback, and Casey sees it in the crew's tools.
