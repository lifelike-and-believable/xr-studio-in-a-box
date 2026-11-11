---
id: epic-provenance-and-policy
status: approved
derived-from:
  - requirements-governance#REQ-governance-1: 9027a08ab0d2
  - requirements-governance#REQ-governance-2: 8c09b926201c
  - requirements-governance#REQ-governance-3: 8d45b7d44834
  - requirements-governance#REQ-governance-4: 7a7b6b633e3c
  - requirements-governance#REQ-governance-5: efaefdbbd1f8
  - requirements-governance#REQ-governance-6: 8c8131f52ea4
  - persona-collaborator#goals: 72c41c51284f
  - persona-director#goals: a92ca172be83
---

# Keep the terms, and know where every asset came from

<!-- Layer 1, project backbone. -->

## Outcome

Each project records what its collaborators have agreed. Generation that breaks those terms does not run, every asset carries its history from the day it enters the project, and a collaborator can sign off what they were asked to, without seeing the rest.

## Personas

- persona-collaborator: agreed terms hold, and the review asked of them is limited and clear.
- persona-director: AI is used only where collaborators have agreed to it.

## Proposed stories

- Record a collaborator's terms in the project's policy record, with a dated history and optional end dates that flag the assets they cover.
- Choose what the gate does when a collaborator has recorded no AI term.
- Block a generation request that breaks a term, and say which term blocked it.
- Attach a provenance record to every asset as it enters the project, with restricted access to prompts and reference inputs.
- Hold a generated asset out of the project until its quality checks and licence status are recorded.
- Review and sign off a shared item through a limited page, with who and when recorded.

## Stories

- story-provenance-and-policy-record-terms
- story-provenance-and-policy-no-term-choice
- story-provenance-and-policy-block-generation
- story-provenance-and-policy-provenance-record
- story-provenance-and-policy-quality-and-licence-gate
- story-provenance-and-policy-collaborator-sign-off

## Release groups

- The policy record, the no-term choice and the block ship together: the gate means nothing without terms to check.
- The provenance record and the quality and licence gate ship together, before any generated asset enters a project.
- Collaborator sign-off can ship on its own, before the first project that names a sign-off.

## Dependencies

- epic-project-record, for projects, people and roles.
- epic-review-and-status, for the sign-off wait.

## Open questions

- Answered: a collaborator's review page shows the item, the term it relates to and a plain statement of what is asked. They can sign off, decline or comment, with no deadline pressure and no AI recommendation shown. This is a first draft, to check with a cultural consultant.
- Answered: until epic-asset-checks exists, the quality checks are that the file opens, it is named correctly, and its provenance and licence status are recorded. A person looks at each asset, and the look is recorded, only when it leaves its stage at a gated hand-off, so agents still work freely inside a stage (REQ-workflow-2).

## Out of scope

- The library view for browsing provenance, which comes later.
- Asset reuse across projects (REQ-governance-8), which arrives with the content layer.
- Guest and performer consent (REQ-governance-7, REQ-governance-9), which belong to the audience layer and epic-session-recording.
