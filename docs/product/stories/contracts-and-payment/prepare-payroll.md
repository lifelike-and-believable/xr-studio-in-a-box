---
id: story-contracts-and-payment-prepare-payroll
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Prepare payroll and payment information from hours and amounts

As Jordan, the producer, I want payroll and payment figures prepared from confirmed hours and agreed rates so that I keep the pay and payment records each contract and tax rule requires, drafted for me to check and send.

## Acceptance criteria

- Hours come from time records that a person confirms: the person who worked them, or Jordan. An agent can draft time records from the schedule (story-schedule-and-touring-schedule) and call sheets (story-schedule-and-touring-call-sheets) but cannot confirm them. Rates and fees come from the pay terms in each person's signed contract record (story-contracts-and-payment-draft-and-track-contracts).
- An agent prepares, for each person and pay period, the hours, rate, fees and gross amount. Deductions and withholdings are rules Jordan records with their source and the date they were checked. An agent can draft a rule from a source document but cannot record or change it. The figures are marked as a draft for a person to check, not professional or tax advice.
- Bank details and tax numbers are added only by a person, from the protected store (story-contracts-and-payment-protect-sensitive-data), when they export the figures. An agent works with hours and amounts only.
- A person exports the checked figures as a spreadsheet for whoever runs payroll, such as an accountant or payroll provider. An agent cannot submit a payment, a payroll run or a tax filing. A person records each payment made and its date.
- Only people whose role needs them see pay figures (REQ-workflow-17). Each paid person can see their own figures on their limited page, and nothing else in the project. Prepared figures and payment records are kept under story-contracts-and-payment-keep-records.
- The story is tested with sample time records and contracts: figures are prepared, each is traced to its hours and rate, an unconfirmed time record is checked to be left out, and an agent is checked to be refused when it tries to confirm hours or export with identifiers.
