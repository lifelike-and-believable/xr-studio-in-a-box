---
id: story-funding-record-decision
status: approved
derived-from:
  - epic-funding#outcome: 1d1f64414639
  - persona-producer#goals: d1cc47b03be9
---

# Record a funding decision

As Jordan, the producer, I want a funder's decision on a submitted application recorded once, with its amount, conditions, payments and dates, so that reports, claims, the budget and credits are drafted from one record of project facts and I check them before I send them.

## Acceptance criteria

- For an application whose submission is recorded (story-funding-draft-application), the person the project records as holding the funding applications and reports approval (story-project-record-name-approvers) records the funder's decision: awarded or declined, its date and the funder's letter. For an award, the record holds the amount awarded beside the amount asked, the conditions, the payment schedule (each instalment's amount, expected date and any condition on it, such as a report), the acknowledgement wording the funder requires, and the report and claim dates. This story defines a funding decision and an award. Other stories refer to them by this story's id.
- An agent can draft the decision from the funder's letter a person points it at, marked as a draft until the holder accepts it, with bank details and other identifiers hidden as for proof of spend (story-budgets-and-cost-track-actual-cost). An agent cannot record, accept or change a decision.
- An award's report and claim dates appear with the project's deadlines (story-funding-program-list) and are the dates its reports and claims are drafted for (story-funding-reports-and-claims). Each instalment appears as a confirmed income line with its expected date (story-budgets-and-cost-build-a-budget). Where the amount awarded is less than asked, the difference is shown in text against the submitted budget for a person to revise.
- The acknowledgement wording is added to credits drafts (story-credits-and-outreach-build-credits) and promotion drafts (story-credits-and-outreach-draft-promotion) for the project, and a draft that leaves it out is flagged in text. A decline marks the project's pending income lines from that program in text, for a person to change or remove.
- Decisions are shown only to people whose role covers funding (story-project-record-add-person). Each decision and the funder's letter are business records kept under story-contracts-and-payment-keep-records.
- The story is tested with a sample project with two submitted applications: an award paid in two instalments with one report date, and a decline. The report date is checked to appear with the deadlines, the instalments as confirmed income, the wording in a credits draft, and the decline's pending income to be marked. An agent is checked to be refused when it tries to record a decision.
