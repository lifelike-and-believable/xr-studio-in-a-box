---
id: story-contracts-and-payment-legal-reviews
status: approved
derived-from:
  - epic-contracts-and-payment#outcome: 98a1377bb7cd
  - persona-producer#goals: d1cc47b03be9
---

# Commission and track legal reviews

As Jordan, the producer, I want to commission each legal review the project needs and track it to the point it is recorded so that I know what is blocked and who owns it.

## Acceptance criteria

- This story defines the legal review list: every legal review that a requirement or story needs before a feature is used with guests, in public or under a changed agreement, such as guest data per region (REQ-governance-7), sensing, the room view, venue audio, minors joining remotely, incident records and a changed performer agreement (REQ-governance-9). Each entry shows its subject, the region or venue it covers, the features it blocks with their story ids, its state (not started, commissioned, answered, recorded), who commissioned it and the reviewer. Other stories refer to the list by this story's id.
- Jordan, or a person whose role allows it, commissions a review: names the reviewer, such as an outside lawyer, and records the date asked and the date expected. A person sends each request outside the project (REQ-workflow-14). An agent can draft the list's entries and a request, but cannot send a request, commission a review or change its state.
- A review is marked recorded only when the approval holder named in the story it gates records that it is done, as that story says, usually the holder of the audience-facing safety and consent approval (story-project-record-name-approvers). The reviewer's answer is kept as a business record (story-contracts-and-payment-keep-records), visible only to Jordan, that holder and people whose role needs it.
- The status board (story-review-and-status-status-board) shows each feature that waits on a review, with the review it waits for and its state, in text. An answered review that no one has recorded is flagged after a time Jordan sets.
- The list says in text that it is not legal advice.
- The story is tested with a simulated project holding three reviews in different states: the status board is checked to show the blocked features, an agent is checked to be refused when it tries to commission or record a review, and a role with no need is checked to be unable to see the answers.
