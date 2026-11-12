---
id: story-funding-tax-credits
status: approved
derived-from:
  - epic-funding#outcome: 1d1f64414639
  - persona-producer#goals: d1cc47b03be9
---

# Track spend and documents for tax credits and incentives

As Jordan, the producer, I want spend and documents that may qualify for tax credits and production incentives tracked and gathered as the production goes so that I keep the records each tax rule requires.

## Acceptance criteria

- Tax credits and incentives the project may claim are kept in the program list (story-funding-program-list), with their rules, the rule check and the person who confirms it. Jordan chooses which ones the project tracks.
- For each tracked incentive, an agent marks cost lines (story-budgets-and-cost-track-actual-cost) and hours that may qualify, as drafts, with the rule each mark relies on. A person whose role allows it accepts or rejects each mark. An agent cannot accept one.
- Jordan sees, for each tracked incentive, the cost lines and hours accepted so far, their total, and the documents each rule asks for that are still missing, in text.
- Jordan can export what is gathered for an incentive as a spreadsheet file for an accountant or adviser (story-budgets-and-cost-work-alone). The export leaves the project only when a person exports or sends it, never an agent.
- Agents work with hours and amounts only. They never see tax numbers, bank details or similar identifiers (REQ-business-16).
- Every total and mark is shown as a draft for a person or their adviser to check, not tax advice. Which rules apply to a production is pending review.
