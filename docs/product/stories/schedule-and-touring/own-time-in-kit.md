---
id: story-schedule-and-touring-own-time-in-kit
status: approved
derived-from:
  - epic-schedule-and-touring#outcome: 4e30b30b18d6
  - persona-performer#goals: 72110c93fc2a
---

# See my own time in kit, limits and history

As Kai, the performer, I want to see my own time in kit, my limits and the dated history of both on my limited page so that I work within limits on my time in a headset or suit and can stop whenever I need to.

## Acceptance criteria

- Kai's limited page (story-session-recording-record-agreement), which shows nothing in the project beyond Kai's own records, also shows Kai's time in kit (story-schedule-and-touring-time-in-kit) for each stretch and each day, Kai's current limit (longest stretch, shortest break, most time in a day and warning time) or "no limit set", and Kai's planned time in kit on each of Kai's confirmed calls (story-schedule-and-touring-schedule). A limit waiting for Kai's confirmation is shown as waiting, and Kai can confirm it on this page. The confirmation is logged with the date, as story-schedule-and-touring-time-in-kit says. It shows nothing about any other performer.
- The page shows a dated history of both: each version of Kai's limit with who set it and when Kai confirmed it, and for each day the stretches, breaks and time past a limit, with each correction and who made it, when and why.
- Apart from Kai confirming a waiting limit, the page only shows these records. Counts are corrected and limits set as story-schedule-and-touring-time-in-kit says, and nothing else on the page can change them. An agent cannot change what the page shows.
- Only Kai can open Kai's page. Times and limits are shown as numbers in text, not by colour or a chart alone, and the page meets WCAG 2.2 AA (REQ-workflow-18).
- The story is tested with the sample project in story-schedule-and-touring-schedule, with Kai's counts and limits from the rehearsal in story-schedule-and-touring-time-in-kit and a second performer whose counts and limits are simulated for the test. Kai's page is checked to show Kai's own stretches, days, planned time, a correction and a changed limit, and to show nothing of the other performer. Kai confirms a waiting limit on the page, and the confirmation is checked to be logged with the date. The other performer and a person with no performer role are checked to be refused Kai's page, and the page is checked with an accessibility checker and a screen reader.
