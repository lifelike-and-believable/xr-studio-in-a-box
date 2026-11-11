---
id: story-handover-and-fallback-trigger-handover
status: approved
derived-from:
  - epic-handover-and-fallback#outcome: 26b61211e6b4
  - persona-performer#goals: 9de25c7bbe59
---

# Trigger a handover while performing

As Kai, the performer, I want to trigger a handover from a control I can use while performing, or have a cue trigger it, so that I can hand over a channel while performing.

## Acceptance criteria

- Kai can trigger a set handover (story-handover-and-fallback-hand-over-a-channel) through a gesture, controller, pedal or device, without looking at a screen or using a keyboard.
- A cue message can trigger a set handover. Until the cue list in the show control layer exists, this is tested with a simulated cue.
- Casey, or the show's operator, can arm and disarm the performer's control by section of the show, and a disarmed control does nothing. In a show declared as solo, with no operator, the handover control cannot be disarmed. An agent cannot arm or disarm it in show mode. Until show sections and the solo declaration exist in the show control layer, both are simulated in the test.
- Kai gets the performer signal's pattern for a finished handover (story-handover-and-fallback-performer-signal).
- Each triggered handover is logged with the control or cue that started it.
