---
id: story-schedule-and-touring-travel-checklist
status: approved
derived-from:
  - epic-schedule-and-touring#outcome: 4e30b30b18d6
  - persona-producer#goals: d1cc47b03be9
---

# Draft a travel checklist for each trip

As Jordan, the producer, I want a travel checklist drafted for each trip in the schedule so that travel, like call sheets, is drafted from one record of project facts and I check it before I book.

## Acceptance criteria

- A trip is a set of confirmed calls (story-schedule-and-touring-schedule) at a venue away from where the people called are based, from the first travel day out to the last travel day back, which Jordan marks as a trip. A travel checklist lists, for one trip, the people called with their travel and load-in calls, how the kit travels (carried, shipped or provided by the venue) from the equipment manifest (story-schedule-and-touring-manifests-and-checklists), and what must be booked, such as transport, rooms and kit shipping, each with its state (to book, booked or not needed) in text. Facts are read from the schedule, the manifest and the venue profile (story-venue-setup-venue-profile), never typed again (REQ-business-10). This story defines a travel checklist. Other stories refer to it by this story's id.
- An agent, or Jordan, drafts a travel checklist. Jordan, or another person whose role allows it, confirms each item. A person makes every booking and payment, marks the item booked, and records its cost as a cost line (story-budgets-and-cost-track-actual-cost). An agent never books, pays or sends anything outside the project (REQ-workflow-14, REQ-business-8), and cannot confirm an item or mark it booked.
- Passport numbers, visa numbers and similar identifiers a booking needs are on the protected store's list of identifiers, which Jordan keeps, and are kept only in the protected store (story-contracts-and-payment-protect-sensitive-data). An agent never sees them: the checklist shows a placeholder, filled in only in the copy a person exports or sends.
- Jordan and people whose role needs it see the whole checklist. Each other person called sees only their own travel and load-in calls (REQ-workflow-17). Each version is dated and names who made it. A change to a confirmed call, the manifest or the venue profile marks the checklist out of date, in text, and Jordan is told by the channel they chose (story-review-and-status-notifications), until a person confirms the changes.
- The checklist works with no other software. Jordan can export it as a spreadsheet file (CSV and .xlsx), holding only what Jordan's role can see. A travel booking tool is connected through an adapter (story-budgets-and-cost-connect-a-tool) only once a real project needs one.
- The story is tested with the sample project in story-schedule-and-touring-schedule and a trip to one of its venue profiles: an agent drafts the checklist, a person confirms items and marks one booked with its cost, and a call is changed to mark the checklist out of date. An agent's attempts to confirm an item, mark it booked and read a test passport number are checked to be refused and logged, and the drafts, log, notifications and previews are searched for the test passport number and none is found.
