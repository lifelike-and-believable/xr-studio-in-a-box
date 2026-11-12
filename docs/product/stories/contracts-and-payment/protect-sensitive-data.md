---
id: story-contracts-and-payment-protect-sensitive-data
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Keep bank details and tax numbers away from agents

As Jordan, the producer, I want bank details, tax numbers and similar identifiers kept where only a person with the right role can reach them so that agents can draft contracts, invoices and payroll from hours and amounts while I check and send them.

## Acceptance criteria

- Bank details, tax numbers and the other identifiers on a list Jordan keeps are entered into, and kept only in, a protected store. Only people whose role allows it, set by Jordan or a person with the right role (story-project-record-add-person), can open it (REQ-workflow-17). An agent cannot be granted it (story-agent-work-agent-permissions).
- Identifiers never reach anything an agent can read: the project facts, drafts, chat with an agent, the activity log, notifications or review previews. Drafts show a placeholder, filled in only in the copy a person sends or exports.
- When a person types or pastes text that matches a listed identifier's format into a place an agent can read, it is not saved there, and the person is told in plain words to use the protected store.
- Each opening of the store and each identifier added to a sent or exported copy is logged with who and when, without the value. An agent asking for an identifier is refused, and the refusal is logged.
- The protected store is backed up and restored only by people whose role allows it (story-project-record-back-up-and-restore). Nothing financial is stored by the quotes, invoices or payroll stories before this story is built.
- The story is tested with test identifiers: an agent with every other grant tries to reach them, and the facts, drafts, chat, log, notifications and previews are searched for them and none is found.
