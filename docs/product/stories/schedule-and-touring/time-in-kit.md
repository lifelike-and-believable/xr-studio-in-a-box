---
id: story-schedule-and-touring-time-in-kit
status: approved
derived-from:
  - epic-schedule-and-touring#outcome: 4e30b30b18d6
  - persona-performer#goals: 72110c93fc2a
---

# Track each performer's time in a headset or suit against a set limit

As Kai, the performer, I want my time in a headset or suit tracked against a limit I set with the director, and to be told when I near it, so that I work within limits on my time in a headset or suit and can stop whenever I need to.

## Acceptance criteria

- Time in kit is the time a performer wears a headset or a capture suit for the project, counted for each stretch without a break and for each day. This story defines time in kit. Other stories refer to it by this story's id. Each performer has their own limit: the longest stretch, the shortest break between stretches, the most time in a day, and a warning time before each limit. The director or their delegate sets it with the performer, from rehearsal, in production mode (story-show-safety-switch-modes), and it applies only once Kai confirms it on Kai's page (story-schedule-and-touring-own-time-in-kit), recorded with the date. A changed limit is set and confirmed the same way, with a dated history. A performer with no confirmed limit shows "no limit set" in text in the schedule and on the operator console. An agent cannot set, confirm or change a limit.
- A stretch starts when Kai's assigned headset reports that it is worn, where it can, or when Kai's suit starts sending data assigned to Kai, and ends when that stops for longer than a time Casey sets. Casey or Kai can also mark kit on or off in one step. Kai does it with a kit control within reach while performing, such as a button on the suit or a hand controller, with no keyboard or screen needed. The control needs a press held for a time Kai sets, so it does not fire by accident during a full run, and Kai perceives that it has acted in at least two senses. It is never disarmed, by section (story-cue-list-performer-fired) or in any other way, and on a solo show it can be the same device as the solo controls (story-show-safety-solo-show). Casey can correct a count, and each correction is logged with who made it, when and why. Counting reads the devices only, and changes nothing in what drives a character.
- At the warning time and at each limit, Kai and the cast and crew named for the session are told on the crew channel (story-performer-support-crew-channel), as text and read aloud, and the operator console shows each performer's time in kit and time left in text. Reaching a limit does not stop the show or take Kai's character away by itself. Time past a limit is shown in text and logged.
- Kai can always stop, before or after a limit. When Kai's kit goes off, because the headset's not-worn sensor reports it where it has one, or Kai or Casey marks it off, Kai's channels switch to their fallback (story-handover-and-fallback-define-fallback), as they do when an input drops (story-handover-and-fallback-automatic-switch), and on a solo show Kai also has the controls in story-show-safety-solo-show. No setting can require Kai to stay in kit, and Kai is not asked for a reason for stopping.
- Only Kai, the director or their delegate, Jordan for scheduling (story-schedule-and-touring-schedule) and the cast and crew named for the session see a performer's time in kit and limits. Counting and the crew channel messages work with every agent and the internet disconnected.
- The story is tested in rehearsal with a real performer on the first release's test kit (story-build-and-install-measure-against-budget), wearing a PC VR headset and the portable inertial suit, with limits shortened to minutes: stretches start and end, a break is counted, a correction is made, each message is checked as text and read aloud, and Kai stops before a limit and the fallback takes over. The director or their delegate and the performer set the first real limits from this rehearsal before the story is accepted.
