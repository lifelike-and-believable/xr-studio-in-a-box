---
id: epic-contracts-and-payment
status: approved
derived-from:
  - requirements-business#REQ-business-7: 2e80543d3684
  - requirements-business#REQ-business-8: e158736d4202
  - requirements-business#REQ-business-16: 4b8ef13fe1c5
  - requirements-business#REQ-business-17: 6f7a43ab9463
  - persona-producer#goals: d1cc47b03be9
  - persona-collaborator#goals: 72c41c51284f
---

# Agreements and payments, with a person in charge

<!-- Business layer, in parallel with the others. Funding comes first. -->

## Outcome

Contracts, licences, quotes and invoices are drafted and tracked, payroll information is prepared, sensitive data stays away from agents, and records are kept as long as required.

## Personas

- persona-producer: drafts quickly, and approves everything.
- persona-collaborator: knows agreed terms are recorded.

## Proposed stories

- Draft and track contracts, licences and AI-use terms, with a person accepting them.
- Draft quotes and invoices.
- Prepare payroll and payment information from hours and amounts.
- Keep bank details and tax numbers where only a person with the right role can reach them.
- Keep records for as long as each rule requires, showing why and until when.
- Commission each legal review the project needs, and track it until the approval holder records it.

## Stories

- story-contracts-and-payment-draft-and-track-contracts
- story-contracts-and-payment-quotes-and-invoices
- story-contracts-and-payment-prepare-payroll
- story-contracts-and-payment-protect-sensitive-data
- story-contracts-and-payment-keep-records
- story-contracts-and-payment-legal-reviews

## Release groups

- Sensitive data limits ship first: nothing financial is stored before them.
- Contracts ship next, because terms feed the policy record.
- Quotes, invoices and payroll follow.

## Dependencies

- epic-project-record.
- epic-provenance-and-policy.

## Open questions

- Answered: each record carries every retention rule that applies to it (funder, tax rule, contract or jurisdiction) and is kept for the longest of them. Where a period is unknown, nothing is deleted until a person with the right role records the rule. Deletion always needs a person. Guest data stays under REQ-governance-7 (deleted when a session ends unless the guest opts in) and is not a business record. The periods themselves stay pending until each rule is recorded from its source. Settled in story-contracts-and-payment-keep-records.

## Out of scope

- Client handover (REQ-business-18), which is later.
- Submitting a payment or tax filing.
