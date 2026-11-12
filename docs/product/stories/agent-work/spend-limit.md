---
id: story-agent-work-spend-limit
status: approved
derived-from:
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-producer#goals: d1cc47b03be9
---

# Stop spend at the limit

As Jordan, the producer, I want to set a project's spend limit and have agents stop before they pass it so that spend does not pass the limit without someone deciding that it should.

## Acceptance criteria

- A new project has no limit, and metered work stays blocked until a person sets one. The person whose work is blocked is told in plain words that no limit is set and who can set it.
- Jordan can set and change the limit, if their role allows it.
- When a request would pass the limit, the agent stops and asks a person with the right role. Before each metered call, including the agent's own model use, the agent reserves the call's highest estimated cost, so a vendor price change can take spend past the limit by at most one call. The limit is set in the production's currency.
- Jordan can see spend so far against the limit (story-budgets-and-cost-cost-and-schedule-view).
