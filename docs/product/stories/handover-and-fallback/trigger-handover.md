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
- A cue (story-cue-list-build-a-cue-list) can trigger a set handover.
- Casey, or the show's operator, can arm and disarm the performer's control by section of the show (story-cue-list-performer-fired), and a disarmed control does nothing. In a show declared as solo (story-show-safety-solo-show), the handover control cannot be disarmed. An agent cannot arm or disarm it in show mode.
- Kai gets the performer signal's pattern for a finished handover (story-handover-and-fallback-performer-signal).
- Each triggered handover is logged with the control or cue that started it.
