---
id: story-schedule-and-touring-call-sheets
status: approved
derived-from:
  - epic-schedule-and-touring#outcome: 4e30b30b18d6
  - persona-producer#goals: d1cc47b03be9
---

# Draft call sheets for a person to approve and send

As Jordan, the producer, I want call sheets drafted from the schedule and the project's facts, for me to check, approve and send, so that call sheets are drafted from one record of project facts and I check them and send them.

## Acceptance criteria

- A call sheet covers one day of the schedule (story-schedule-and-touring-schedule). It lists the day's calls, each person called with their role and call time, the place and how to reach it from the venue profile (story-venue-setup-venue-profile), the project contacts for the day by role, each performer's planned time in kit against their limit (story-schedule-and-touring-time-in-kit), and a link to the equipment manifest and set-up checklist for that venue where they exist (story-schedule-and-touring-manifests-and-checklists). Each fact is read from the record, not typed again. This story defines a call sheet. Other stories refer to it by this story's id.
- An agent, or Jordan, drafts a call sheet. A draft goes to the review queue (story-review-and-status-see-review-queue) and is sent only after Jordan, or another person whose role allows it, approves it there (story-review-and-status-decide-on-items). Only a person sends it, after approval (REQ-workflow-14). An agent cannot approve or send a call sheet, or change one after approval.
- A call sheet shows a person's contact details only where that person chose to share them on call sheets. It never holds bank details, tax numbers or similar identifiers (REQ-business-16), or guest data. Each person receives it by the channel they chose (story-review-and-status-notifications) and can also open it as a printable file. Its web view meets WCAG 2.2 AA (REQ-workflow-18).
- Each sent version is kept with who approved it, who sent it, when and to whom (story-review-and-status-feedback-and-versions). If a confirmed call for that day changes after sending, Jordan sees the sent call sheet marked out of date, in text and in the review queue, and a revised draft is made. People receive the revision only once a person approves and sends it, marked "revised" with what changed in plain words.
- The story is tested with the sample project in story-schedule-and-touring-schedule: a call sheet is drafted by an agent, sent back for revision with written feedback, approved and sent to test addresses, then a call is changed and the revision is approved and sent. The test checks that an agent's attempt to approve or send is refused and logged, and that a person with no shared contact details shows none.
