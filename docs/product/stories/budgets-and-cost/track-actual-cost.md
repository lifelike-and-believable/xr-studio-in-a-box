---
id: story-budgets-and-cost-track-actual-cost
status: approved
derived-from:
  - epic-budgets-and-cost#outcome: 5b1afee150ed
  - persona-producer#goals: d1cc47b03be9
---

# Track actual cost, including generation, cloud and per-show costs

As Jordan, the producer, I want actual cost tracked against the budget as it happens, including generation, cloud and per-show running costs, so that spend does not pass the project's limit without someone deciding that it should.

## Acceptance criteria

- Each actual cost is a cost line with its amount, date, the budget line it counts against (story-budgets-and-cost-build-a-budget), its source and who recorded it. A cost line can carry its proof of spend, such as an invoice or a receipt. This story defines a cost line and its proof of spend. Other stories refer to them by this story's id.
- Generation and cloud cost metered through an adapter (story-agent-work-tool-adapter) is recorded as cost lines automatically, with the tool, the run and the request, and counts toward spend so far against the spend limit (story-agent-work-spend-limit). Cloud sessions for guests are recorded per show and session (story-remote-guests-move-past-the-limit).
- Per-show running costs are worked out from the session log (story-session-operations-reset-for-next-session) and rates that a person whose role allows it sets, such as staff per session or kit hire per day. Recording them never needs the show to reach an agent or the internet in show mode (story-show-safety-switch-modes).
- Other costs are entered by a person whose role allows it. An agent can draft a cost line from a receipt or invoice a person gives it, marked as a draft until that person accepts it.
- A cost in another currency is recorded in that currency, with the rate and its date that a person whose role allows it records.
- Agents work with amounts only. Bank details and tax numbers on proof of spend are hidden from agents, and only a person with the right role sees them (REQ-business-16). Only people whose role covers cost see cost lines.
