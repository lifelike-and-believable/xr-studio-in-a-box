---
id: story-budgets-and-cost-cost-and-schedule-view
status: approved
derived-from:
  - epic-budgets-and-cost#outcome: 5b1afee150ed
  - persona-producer#goals: d1cc47b03be9
---

# See budget against actual cost and the schedule

As Jordan, the producer, I want to see budget against actual cost next to the production schedule so that I keep budget, actual cost and schedule in one view.

## Acceptance criteria

- For each budget line (story-budgets-and-cost-build-a-budget), Jordan sees the budget, the actual cost so far (story-budgets-and-cost-track-actual-cost) and what remains. Generation, cloud and per-show running costs each show as their own total, and per show and session where they come from sessions.
- Lines over budget, and the spend so far against the spend limit (story-agent-work-spend-limit), are shown in text with the amount, not by colour alone.
- On the same view, Jordan sees the production schedule from the project facts (story-project-record-record-facts, story-schedule-and-touring-schedule) and the funder deadlines (story-funding-program-list), in date order.
- Jordan is told when a budget line passes a share of its budget that Jordan sets, by the channel Jordan chooses (story-review-and-status-notifications).
- The view shows the same figures in the dashboard and in chat (story-project-record-same-project-state), only to people whose role covers cost, and meets WCAG 2.2 AA.
