---
id: story-credits-and-outreach-ai-use-statement
status: approved
derived-from:
  - epic-credits-and-outreach#outcome: 0f5f6bfb915f
  - persona-producer#goals: d1cc47b03be9
---

# Draft an AI-use statement from provenance records

As Jordan, the producer, I want a statement of how AI was used drafted from the provenance records so that the AI-use statements in funding applications and reports are drafted from one record of project facts, and I check them and send them.

## Acceptance criteria

- An agent can draft a statement of how AI was used on a project, or on one show, from the provenance records of its assets (story-provenance-and-policy-provenance-record): which assets used AI, at which stage, with which tool, what a person changed afterwards, and the terms in force. Where a funder or partner asks for a format, the draft follows it. This story defines the AI-use statement. Other stories refer to it by this story's id.
- The statement includes no prompts or reference inputs unless the approver chooses to, and an agent drafting it reads only the fields its grant allows (story-agent-work-agent-permissions). Performer data use is described as far as the performer's agreement (story-session-recording-record-agreement) allows, and each performer is named only as their agreement says they are named or credited.
- Every claim in the statement links to the records it came from. While any asset in its scope has no provenance record, the draft says how many and which, and it cannot be approved.
- The statement waits at the AI-use statements and credits gate (story-review-and-status-hold-gated-hand-off) for the approver named for that area (story-project-record-name-approvers). An agent cannot approve it. A statement inside a funding application or report is also approved with that document by the holder of the funding approval, and a published one by the holder of the publishing and marketing approval. Only a person sends it outside the project.
- Before assets exist, such as for a funding application, an agent can draft a statement of planned AI use from the production plan in the project facts (story-project-record-record-facts), the policy record (story-provenance-and-policy-record-terms) and the tools granted to agents (story-agent-work-tool-adapter, story-agent-work-agent-permissions). It is marked as planned in text, each claim links to the plan, term or grant it came from, and it passes the same gate. Once assets in its scope have provenance records, later documents use a statement drafted from the records, which lists in plain words where it differs from the planned one. When the plan, terms, grants or provenance records behind an approved statement change, it is flagged, says what changed, and the new version goes back to review.
- The story is tested with a sample project whose assets include AI-generated, hand-made and edited assets and one with no record: the statement is checked against the records and checked to be blocked from approval until the missing record exists. A planned statement is drafted for the same project before its assets exist and checked to be marked as planned, to link each claim to the plan, a term or a grant, and to list its differences from the statement drafted later from the records.
