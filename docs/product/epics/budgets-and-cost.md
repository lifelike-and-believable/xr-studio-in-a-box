---
id: epic-budgets-and-cost
status: approved
derived-from:
  - requirements-business#REQ-business-4: c235fbb5842b
  - requirements-business#REQ-business-13: a34702a25461
  - requirements-workflow#REQ-workflow-6: 4e65057accf4
  - persona-producer#goals: d1cc47b03be9
  - persona-director#goals: a92ca172be83
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Know what a production costs while it happens

<!-- Business layer, in parallel with the others. Funding comes first. -->

## Outcome

Budgets are built per project and funder, actual cost is tracked including generation, cloud and running costs, and the tools work alone or connect to third-party software.

## Personas

- persona-producer: sees budget against actual cost and the schedule.
- persona-director: runs this alone on a solo production.
- persona-technical-artist: connects a third-party tool through an adapter.

## Proposed stories

- Build a budget per project and funder format.
- Track actual cost, including generation, cloud and per-show costs.
- See budget against actual cost and the production schedule.
- Use the business tools alone, with no other software.
- Connect accounting, calendars or e-signature through an adapter.

## Stories

- None yet.

## Release groups

- Budgets and cost tracking ship first, because funding reports depend on them.
- The cost and schedule view follows.
- Adapters ship when a production needs them.

## Dependencies

- epic-project-record.
- epic-agent-work, for metered spend.

## Open questions

- Which third-party tool, if any, comes first?

## Out of scope

- Moving money: an agent never does.
