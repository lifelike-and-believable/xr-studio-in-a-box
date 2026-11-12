---
id: story-budgets-and-cost-connect-a-tool
status: approved
derived-from:
  - epic-budgets-and-cost#outcome: 5b1afee150ed
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Connect a business tool through an adapter

As Sam, the technical artist, I want to connect an accounting, calendar or e-signature tool through an adapter so that I can replace it later without rewriting the workflow around it.

## Acceptance criteria

- A third-party business tool connects through an adapter (story-agent-work-tool-adapter). The built-in tools stay in place, and they work as before when the connection is off or removed.
- The first tool is chosen once a real project needs one. Jordan, or the director on a solo production, records which tool and why before the story is accepted. No tool is assumed before then.
- Before its first real use, the person the project records as holding the contracts and licence terms approval (story-project-record-name-approvers) records the tool's terms on data it receives. Sam names which records the connection sends. A person whose role allows it turns the connection on, and that approval is recorded (REQ-workflow-14). An agent cannot turn it on or widen what it sends.
- Agents never see bank details, tax numbers or the tool's credentials through the connection (REQ-business-16). Identifiers the tool needs are sent from the protected store (story-contracts-and-payment-protect-sensitive-data) by a person. A connected tool never lets an agent move money, submit a payment, file anything, or send anything outside the project, and a connected e-signature tool never lets an agent sign or send anything for signature (REQ-business-8, REQ-workflow-14).
- Sam can replace the connected tool with another of the same kind without changing the workflow that uses it. The test replaces the chosen tool with a simulated one and checks that every record still matches.
