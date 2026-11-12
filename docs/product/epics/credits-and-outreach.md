---
id: epic-credits-and-outreach
status: approved
derived-from:
  - requirements-business#REQ-business-11: 45c062f0b411
  - requirements-business#REQ-business-12: 921a37ca47a9
  - requirements-business#REQ-business-14: cca4a99cc49f
  - requirements-business#REQ-business-15: 32af0b76f2d5
  - persona-producer#goals: d1cc47b03be9
  - persona-director#goals: a92ca172be83
  - persona-collaborator#goals: 72c41c51284f
---

# Tell people about the work, and credit it properly

<!-- Business layer, in parallel with the others. Funding comes first. -->

## Outcome

Credits and AI-use statements are built from the record, promotion is drafted, and audience data is gathered where consent allows, with a person approving what goes out.

## Personas

- persona-producer: reports to funders and partners.
- persona-director: approves what is published.
- persona-collaborator: is named correctly.

## Proposed stories

- Build credits from project facts and provenance records.
- Draft an AI-use statement from provenance records.
- Draft promotional material, press kits and posts.
- Collect attendance and feedback by session, where consent allows.
- Use audience data in funder and partner reports.
- Not written yet: collect analytics on the player page beyond counts, and any tracking, only for a guest who consents in the pre-show, off by default. They hold no name, contact or device identifier, are deleted on the guest's request with the deletion logged without the data, and need a guardian's consent for a guest under the age of consent (REQ-business-11, REQ-governance-7).

## Stories

- story-credits-and-outreach-build-credits
- story-credits-and-outreach-ai-use-statement
- story-credits-and-outreach-draft-promotion
- story-credits-and-outreach-collect-audience-data
- story-credits-and-outreach-audience-data-in-reports

## Release groups

- Credits and the AI-use statement ship first, because funders ask for them.
- Marketing drafts and audience data can each ship on their own.

## Dependencies

- epic-provenance-and-policy.
- epic-session-operations, for session records.

## Open questions

- Answered: the wording is settled by a test with real audiences that the producer runs and records in the project facts before the first public campaign. No wording is assumed: until the result is recorded, drafts mark the wording as a choice for a person. Settled in story-credits-and-outreach-draft-promotion.

## Out of scope

- Publishing: a person always does this.
