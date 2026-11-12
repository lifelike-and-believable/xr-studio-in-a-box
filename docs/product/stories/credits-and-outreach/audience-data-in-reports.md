---
id: story-credits-and-outreach-audience-data-in-reports
status: approved
derived-from:
  - epic-credits-and-outreach#outcome: 0f5f6bfb915f
  - persona-producer#goals: d1cc47b03be9
---

# Use audience data in funder and partner reports

As Jordan, the producer, I want audience figures drafted into funder and partner reports from the collected data so that I check the reports and send them instead of counting by hand.

## Acceptance criteria

- An agent can draft the audience section of a funder or partner report from the data collected under story-credits-and-outreach-collect-audience-data: attendance per session, show and audience type and feedback summaries, for the period the report covers. Each figure links to the sessions it counts.
- Reports hold combined figures only. A group smaller than a size the holder of the audience-facing safety and consent approval sets is not shown on its own. Until that size is set, every group is hidden and only totals are shown. Quotes from feedback are used only where the guest agreed to quoting when they gave it, and never with anything that identifies them.
- A funder report waits at the funding applications and reports gate (story-review-and-status-hold-gated-hand-off), and only the holder of that approval (story-project-record-name-approvers) approves it. A partner report is approved by Jordan or a person whose role allows it. A person sends each report. An agent cannot (REQ-workflow-14).
- A funder or partner given access sees only the report shared with them, on a limited page (story-provenance-and-policy-collaborator-sign-off). Each sent report is a business record (story-contracts-and-payment-keep-records).
- The story is tested with simulated sessions: the drafted figures are checked against the session logs, a group below the set size is checked to be hidden, and an agent is checked to be refused when it tries to send a report.
