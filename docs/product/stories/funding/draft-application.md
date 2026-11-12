---
id: story-funding-draft-application
status: approved
derived-from:
  - epic-funding#outcome: 1d1f64414639
  - persona-director#goals: a92ca172be83
---

# Draft an application in a funder's format

As Morgan, the director, I want an agent to draft a funding application in the chosen funder's format from the project facts so that I spend less personal time writing applications by hand.

## Acceptance criteria

- An agent drafts an application for a chosen program in that program's format (story-funding-program-list), from the project facts (story-project-record-record-facts), the budget in that funder's format (story-budgets-and-cost-build-a-budget), and, where the funder asks, the credits (story-credits-and-outreach-build-credits) and the AI-use statement (story-credits-and-outreach-ai-use-statement). The first formats are Canada Media Fund, Creative BC, Epic MegaGrants and the Canada Council for the Arts. Drafting is blocked while the program's rules are out of date.
- Each figure and statement in the draft links to the fact it came from. A fact changed after drafting is flagged in the draft in text. Where a fact is missing, the draft names the gap in plain words and leaves it empty. The agent never invents a fact or a figure. Word counts are shown against the format's limits in text.
- The draft waits at the funding applications and reports gate for the person the project records as holding that approval, or their delegate (story-project-record-name-approvers, story-review-and-status-hold-gated-hand-off). It cannot pass the gate while the program's last rule check is older than 7 days.
- Only that person submits the application to the funder. They record that it was submitted, when and which version, and that version is kept unchanged. Recording a submission is blocked while the program's last confirmed rule check is older than 7 days (story-funding-program-list). An agent cannot submit or send it, or anything else, outside the project. Bank details and tax numbers that a funder asks for are entered only by a person with the right role, from the protected store (story-contracts-and-payment-protect-sensitive-data), outside the agent's reach (REQ-business-16).
- Where the program's documents ask for letters of support or confirmation (story-funding-program-list), the draft lists each letter, who it is from and its state (to request, requested, received or not needed) in text. An agent can draft a request, and only a person sends it outside the project (REQ-workflow-14). A collaborator such as Robin can provide a letter on their limited page (story-provenance-and-policy-collaborator-sign-off), and a person whose role allows it adds a letter that arrives another way. Each received letter is attached to the application. The draft cannot pass the gate while a letter the program requires is not received, unless the holder of the funding approval records why it is not needed.
- Before the story is accepted, Jordan chooses a past application as the worked example for the success measure, and records it with the time it took to prepare. The test drafts an application for the same funder from the same facts, and records the time from the start of drafting to the gate, with the review time, against the worked example.
