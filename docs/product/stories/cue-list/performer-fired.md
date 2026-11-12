---
id: story-cue-list-performer-fired
status: approved
derived-from:
  - epic-cue-list#outcome: 26d12b7b12dc
  - persona-performer#goals: 72110c93fc2a
---

# Fire cues while performing, armed by section

As Kai, the performer, I want to fire cues through a gesture, controller, pedal or device, armed only in the sections where I mean to use them, so that I can fire cues while performing without a stray gesture firing one.

## Acceptance criteria

- Kai can fire a cue the show allows to be performer-fired (story-cue-list-build-a-cue-list) through a gesture, controller, pedal, tracked prop (story-shared-characters-tracked-prop) or device, without looking at a screen or using a keyboard. Sam, or another person with the technical artist's role, sets which gesture or device fires which cue, in production mode. A live performer fires cues only once their agreement is confirmed (story-session-recording-record-agreement).
- A performer-fired or audience-fired cue is armed only in the sections the cue list marks for it, and a disarmed cue does nothing. During a session, Alex, or another person whose role allows it, can also arm or disarm a cue by hand, and each change is logged with who made it. This story defines arming by section. Other stories refer to it by this story's id. An agent cannot arm or disarm a cue in show mode.
- In a show declared solo (story-show-safety-solo-show), Kai's emergency stop, pause and handover controls cannot be disarmed.
- When Kai's cue fires, Kai can perceive it in at least two senses, such as touch and sound, with a pattern distinct from those of the performer signal (story-handover-and-fallback-performer-signal). It goes only to Kai and reaches no audience output.
- A performer-fired cue fires within the show's cue timing (story-cue-list-step-and-palette), measured from the moment the gesture is recognised or the device's message arrives. The time to recognise a gesture is measured and shown on its own.
- Each gesture is tested with recorded performer takes (story-session-recording-record-and-replay) that include the gesture and near misses, in armed and disarmed sections, and then with a real performer in rehearsal. The performer and the director or their delegate set the bar for missed and stray fires before the story is accepted.
