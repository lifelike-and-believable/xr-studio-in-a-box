---
id: story-credits-and-outreach-build-credits
status: approved
derived-from:
  - epic-credits-and-outreach#outcome: 0f5f6bfb915f
  - persona-collaborator#goals: 72c41c51284f
---

# Build credits from the project facts and provenance records

As Robin, a collaborator, I want credits built from the project facts and provenance records so that I can see how the work uses what I contributed, and who else is credited.

## Acceptance criteria

- An agent can draft credits for a show or a report from the credits and collaborators in the project facts (story-project-record-record-facts) and the people named in provenance records (story-provenance-and-policy-provenance-record), including each performer named on assets derived from their data. Each credit shows the fact or records it came from. This story defines credits. Other stories refer to them by this story's id.
- Each person is credited with the name and wording recorded for them in the project facts. Where their terms, or how their agreement says they are named or credited (story-provenance-and-policy-record-terms, story-session-recording-record-agreement), limit how they are named, such as a cultural protocol or a wish not to be named, the credits follow it, and the draft says which term applied.
- Credits wait at the AI-use statements and credits gate (story-review-and-status-hold-gated-hand-off) for the approver named for that area (story-project-record-name-approvers). An agent can recommend but cannot approve. Credits that are published also need the holder of the publishing and marketing approval.
- Robin sees how they are credited, and the assets their credit comes from, on their limited page (story-provenance-and-policy-collaborator-sign-off), and can ask for a correction there. A correction goes back to review.
- When the facts or provenance records behind approved credits change, the credits are flagged and say what changed, and the new version goes back to review.
- The story is tested with a sample project: credits are drafted, each credit is traced to its source, a term that limits naming is checked to be followed, and a changed collaborator name is checked to flag the approved credits.
