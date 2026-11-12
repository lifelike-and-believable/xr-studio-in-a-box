---
id: story-contracts-and-payment-protect-sensitive-data
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Keep bank details and tax numbers away from agents

As Jordan, the producer, I want bank details, tax numbers and similar identifiers kept where only a person with the right role can reach them so that contracts and invoices are drafted from one record of project facts with no identifiers in it, and I check them and send them.

## Acceptance criteria

- Bank details, tax numbers and the other identifiers on a list Jordan keeps are entered into, and kept only in, a protected store. This story defines the protected store. Other stories refer to it by this story's id. Only people whose role allows it, set by Jordan or a person with the right role (story-project-record-add-person), can open it (REQ-workflow-17). An agent cannot be granted it (story-agent-work-agent-permissions).
- Identifiers never reach anything an agent can read: the project facts, drafts, chat with an agent, the activity log, notifications or review previews. Drafts show a placeholder, filled in only in the copy a person sends or exports.
- When a person types or pastes text that matches a listed identifier's format into a place an agent can read, it is not saved there, and the person is told in plain words to use the protected store. If the text is not an identifier, the person can confirm so and save it, and the confirmation is logged with who and when. An agent cannot confirm it.
- Each opening of the store and each identifier added to a sent or exported copy is logged with who and when, without the value. An agent asking for an identifier is refused, and the refusal is logged.
- The protected store is backed up and restored separately from the project (story-project-record-back-up-and-restore), only by people whose role allows it. Nothing financial, no proof of spend and no identifier is stored by any story that stores them before this story is built: story-budgets-and-cost-track-actual-cost, story-funding-draft-application, story-funding-tax-credits, story-budgets-and-cost-connect-a-tool, story-funding-reports-and-claims, story-contracts-and-payment-quotes-and-invoices and story-contracts-and-payment-prepare-payroll.
- The story is tested with test identifiers: an agent with every other grant tries to reach them, and the facts, drafts, chat, log, notifications and previews are searched for them and none is found.
