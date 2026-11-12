---
id: story-schedule-and-touring-schedule
status: approved
derived-from:
  - epic-schedule-and-touring#outcome: 4e30b30b18d6
  - persona-producer#goals: d1cc47b03be9
---

# Schedule availability, rehearsals and shoots

As Jordan, the producer, I want to record crew and performer availability and schedule rehearsals, shoots and sessions from it so that the schedule sits in one view with the budget and actual cost.

## Acceptance criteria

- Jordan, or another person whose role allows it, schedules calls in the dashboard with no code. A call is one booked block of work: a rehearsal, a shoot, a session day, a load-in or a travel day, with its date, start and end times, place (a venue profile, story-venue-setup-venue-profile, where it is at a venue) and the people called, each with their role and call time. For each performer called to wear a headset or suit, the call also holds their planned time in kit (story-schedule-and-touring-time-in-kit): its stretches and the breaks between them. This story defines a call. Other stories refer to it by this story's id. The calls are saved as the schedule in the project's facts (story-project-record-record-facts), so call sheets, the cost and schedule view and logistics read the same record. This schedule is for people. When an unattended show opens and closes is set in story-unattended-running-schedule-and-check, and this story does not change it.
- Each person on the project (story-project-record-add-person) can mark the days and times they are available or not, with no reason needed. Jordan sees everyone's availability, and each other person sees only their own availability and calls, unless their role needs more. A call that books a person when they are marked unavailable, or in two calls at once, or a performer whose planned time in kit passes their longest stretch, shortest break or most time in a day (story-schedule-and-touring-time-in-kit), counting their other calls that day, is flagged in plain words and in text, not by colour alone. A flagged call cannot be confirmed until the clash is resolved or Jordan records a reason. A call past a performer's limit cannot be confirmed until the call changes or the limit's setters change the limit.
- An agent can draft calls from availability and the project's facts. Each drafted call is marked as a draft until Jordan, or another person whose role allows it, confirms it. An agent cannot confirm, change or cancel a confirmed call, or tell anyone outside the project about it (REQ-workflow-14). People called see a changed confirmed call marked "changed" in the dashboard, in text, and get it on a revised call sheet (story-schedule-and-touring-call-sheets).
- The schedule works with no other software. Jordan can export the schedule as a spreadsheet file (CSV and .xlsx) and import availability or calls from one. Imported rows arrive as drafts for Jordan to confirm, and a row that does not match a person or place on the project is listed in plain words and not imported. An export holds only what the exporting person's role can see, and only a person takes it out of the project. A calendar tool is connected through an adapter (story-budgets-and-cost-connect-a-tool) only once a real project needs one. The cost and schedule view (story-budgets-and-cost-cost-and-schedule-view) shows these calls.
- The story is tested with a sample project of at least six people and two venue profiles: availability is entered, calls are drafted by an agent and confirmed by a person, each kind of clash is made and flagged, a spreadsheet is exported, edited and imported back, and a person with a narrower role checks that they see only their own calls.
