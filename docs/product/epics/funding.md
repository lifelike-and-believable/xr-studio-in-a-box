---
id: epic-funding
status: approved
derived-from:
  - requirements-business#REQ-business-2: 9167433ca5d8
  - requirements-business#REQ-business-3: c57fa8203fbd
  - requirements-business#REQ-business-5: 0b7e37891188
  - requirements-business#REQ-business-6: ad0c3207b10b
  - persona-producer#goals: d1cc47b03be9
  - persona-director#goals: a92ca172be83
---

# Find funding, apply and report, from one set of facts

<!-- Business layer, in parallel with the others. Funding comes first. -->

## Outcome

Funding programs are matched to projects, applications and reports are drafted from project facts and tracked spend, and a person reviews and submits everything.

## Personas

- persona-producer: stops copying figures between documents.
- persona-director: does this alone on a solo production.

## Proposed stories

- Keep a list of funding programs, with requirements and deadlines.
- Match a project to programs it may qualify for.
- Draft an application in a funder's format, for a person to review and submit.
- Draft interim and final reports and cost claims, with proof of spend.
- Track spend and documents for tax credits and incentives.
- Record a funding decision: the amount awarded or the decline, the conditions, the payment schedule, the acknowledgement wording and the report dates, which feed the deadlines, the reports and claims, the budget's income and the credits. A person with the funding approval records it.

## Stories

- story-funding-program-list
- story-funding-match-programs
- story-funding-draft-application
- story-funding-reports-and-claims
- story-funding-tax-credits
- story-funding-record-decision

## Release groups

- Program list, matching and drafting ship first.
- Reports and claims follow, once tracked spend exists.
- Tax credit tracking can ship on its own.

## Dependencies

- epic-project-record.
- epic-budgets-and-cost.

## Open questions

- Answered: the Canada Council for the Arts. The working funder list is Canada Media Fund, Creative BC, Epic MegaGrants and the Canada Council for the Arts (story-funding-program-list, story-funding-draft-application).
- Answered: settled in story-funding-draft-application: Jordan chooses a past application as the worked example and records it, with the time it took, before the story is accepted.
- Answered: funder rules are rechecked when each program opens a new intake, and again within a week of any submission. A person confirms each check and its date, and out-of-date rules block drafting until they are rechecked (story-funding-program-list).

## Out of scope

- Submitting anything: an agent never does.
