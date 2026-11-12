---
id: story-funding-reports-and-claims
status: approved
derived-from:
  - epic-funding#outcome: 1d1f64414639
  - persona-producer#goals: d1cc47b03be9
---

# Draft reports and cost claims with proof of spend

As Jordan, the producer, I want interim and final reports and cost claims drafted from the project facts and tracked spend, with proof of spend attached, so that I can check them and send them without copying figures between documents.

## Acceptance criteria

- An agent drafts an interim or final report, or a cost claim, for a program with a recorded award (story-funding-record-decision) in its format (story-funding-program-list), from the project facts (story-project-record-record-facts), the budget submitted with the application (story-funding-draft-application) and the tracked cost lines (story-budgets-and-cost-track-actual-cost). Where the funder asks for audience figures, they come only from audience data collected where consent allows (story-credits-and-outreach-collect-audience-data): attendance, feedback and analytics (story-credits-and-outreach-player-page-analytics), drafted as in story-credits-and-outreach-audience-data-in-reports. Drafting is blocked while the program's rules are out of date.
- Each cost in a claim is attached to its proof of spend (story-budgets-and-cost-track-actual-cost). Costs with no proof, and lines that differ from the submitted budget by more than the funder's rule allows, are listed in plain words for Jordan to explain or fix. The agent never invents a figure or an explanation.
- The draft waits at the funding applications and reports gate for the person the project records as holding that approval, or their delegate (story-project-record-name-approvers). It cannot pass the gate while the program's last rule check is older than 7 days. Only that person submits it and records when and which version. Recording a submission is blocked while the program's last confirmed rule check is older than 7 days (story-funding-program-list). An agent cannot submit or send it.
- The agent works with amounts only. Originals of uploaded receipts and invoices stay in the protected store (story-contracts-and-payment-protect-sensitive-data, story-budgets-and-cost-track-actual-cost). An agent gets only their amounts, with bank details, tax numbers and other identifiers hidden, and only a person with the right role sees the originals and attaches them to the copy that is submitted (REQ-business-16).
- Each submitted report, claim and its proof is kept for as long as the rules that apply to it require (REQ-business-17, story-contracts-and-payment-keep-records). Each report and claim deadline appears with the project's deadlines (story-funding-program-list).
- Before the story is accepted, Jordan chooses a past report or claim as the worked example for the success measure, and records it with the time it took to prepare. The test drafts a report or claim for the same funder from the same facts and tracked spend, with an image or PDF receipt as proof, and records the time from the start of drafting to the gate, with the review time, against the worked example.
