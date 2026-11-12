---
id: story-contracts-and-payment-quotes-and-invoices
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Draft quotes and invoices

As Jordan, the producer, I want quotes and invoices drafted from the project's facts and tracked hours and amounts so that I only check them and send them, rather than retyping figures.

## Acceptance criteria

- An agent can draft a quote or an invoice from the project facts (story-project-record-record-facts), the pay terms in a signed contract record (story-contracts-and-payment-draft-and-track-contracts) and the hours (story-contracts-and-payment-prepare-payroll) and amounts (story-budgets-and-cost-track-actual-cost) tracked for the project. Each line shows the fact, contract or tracked figure it came from. Tax rates are rules Jordan records with their source and the date they were checked, which an agent cannot record or change, and each draft is marked as a draft for a person to check, not tax advice.
- Bank details and tax numbers appear only in the copy a person sends, filled in from the protected store (story-contracts-and-payment-protect-sensitive-data). The agent's draft shows a placeholder in their place.
- Jordan, or a person whose role allows it, edits and approves the draft and sends it. An agent cannot send a quote or invoice, move money or submit a payment (REQ-business-8, REQ-workflow-14). A quote that sets terms waits at the contracts and licence terms gate (story-review-and-status-hold-gated-hand-off), and is sent only after the holder of that approval decides it. Once the other party accepts it, it becomes a contract under story-contracts-and-payment-draft-and-track-contracts.
- Each quote and invoice shows its state (draft, sent, accepted, paid, overdue or cancelled) and its due date. A person records each payment received and the date. An agent cannot. Only people whose role needs them see quotes and invoices (REQ-workflow-17).
- Quotes and invoices can be exported as a spreadsheet or a PDF by a person, with no other software needed (REQ-business-13). Each sent quote and invoice is a record kept under story-contracts-and-payment-keep-records.
- The story is tested with a sample project: an invoice is drafted from tracked hours and a contract rate, each figure is traced to its source, and an agent is checked to be refused when it tries to send it or mark it paid.
