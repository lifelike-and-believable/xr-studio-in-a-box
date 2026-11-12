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
- Other costs are entered by a person whose role allows it. The original of each receipt or invoice a person uploads as proof of spend, such as an image or a PDF, goes to the protected store (story-contracts-and-payment-protect-sensitive-data). An agent can draft a cost line from it, getting only its amounts, date and supplier with bank details, tax numbers and other identifiers hidden, marked as a draft until that person accepts it. Agents work with amounts only, and only a person with the right role sees the originals (REQ-business-16). Only people whose role covers cost see cost lines.
- A cost in another currency is recorded in that currency, with the rate and its date that a person whose role allows it records. Metered work billed in a currency with no recorded rate is blocked until a person records one, because its spend cannot count against the spend limit until then (story-agent-work-spend-limit).
- The story is tested with an image receipt and a PDF invoice that carry a test bank account and tax number: the drafted cost line is checked against the amounts, the original is checked to be only in the protected store, and the identifiers are checked to be absent from everything an agent can read. Metered work in a currency with no recorded rate is checked to be blocked.
