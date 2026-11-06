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

## Stories

- None yet.

## Release groups

- Sensitive data limits ship first: nothing financial is stored before them.
- Contracts ship next, because terms feed the policy record.
- Quotes, invoices and payroll follow.

## Dependencies

- epic-project-record.
- epic-provenance-and-policy.

## Open questions

- What are the retention periods per funder and jurisdiction? This is pending.

## Out of scope

- Client handover (REQ-business-18), which is later.
- Submitting a payment or tax filing.
