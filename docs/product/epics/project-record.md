---
id: epic-project-record
status: approved
derived-from:
  - requirements-business#REQ-business-1: aed300619d5b
  - requirements-workflow#REQ-workflow-7: 00c821889f20
  - requirements-workflow#REQ-workflow-16: 8cfdba9f55fa
  - requirements-workflow#REQ-workflow-17: 86d89c96a50f
  - requirements-workflow#REQ-workflow-18: bda71ddedb45
  - persona-director#goals: a92ca172be83
  - persona-producer#goals: d1cc47b03be9
---

# One project, one set of facts

<!-- Layer 1, project backbone. -->

## Outcome

A person can start a project, record its facts once, give people roles, and see the same state from any surface. Project work can be recovered to an earlier version.

## Personas

- persona-director: starts each production here, and can run it alone.
- persona-producer: brings people onto a production and keeps its facts current.

## Proposed stories

- Start a new project with a name, a brief and an owner.
- Record and edit the project's facts: description, plan, budget, credits, collaborators, schedule and samples.
- Add a person and give them a role, with no code or configuration files.
- Name approvers and delegates per area, and record who holds each of the four kinds of approval that never go to an AI.
- See the same project state in the web dashboard and in chat, with the dashboard meeting WCAG 2.2 AA.
- Back up a project, including large binary assets, and restore an earlier version.
- Set up an organisation and keep its company facts (legal name, funder applicant profiles, history, bio and standard work samples), which every project in it reads and never retypes.
- Close a project in one step: end people's access and agent grants, take a final backup, and leave it read-only with its records under retention.

## Stories

- story-project-record-start-project
- story-project-record-record-facts
- story-project-record-add-person
- story-project-record-name-approvers
- story-project-record-same-project-state
- story-project-record-back-up-and-restore
- story-project-record-set-up-organisation
- story-project-record-close-project

## Release groups

- Starting a project, recording its facts and adding people ship together: a project nobody else can join is not useful.
- Backup and restore can ship on their own, but before any real project work is stored.

## Dependencies

- Starting a project places it in an organisation (story-project-record-set-up-organisation). That story takes only the definition of an organisation from epic-shared-library (story-shared-library-save-to-library); it does not need the shared library itself, which comes in Layer 3, so a Layer 1 build makes the organisation alone. Closing a project uses retention from epic-contracts-and-payment.

## Open questions

- Answered: new projects start empty of their own facts. An agent can draft facts from documents a person points it at, for that person to check. Layer 1 has no formal import. Company facts are organisation-level: they are kept once in the organisation and read by every project in it (story-project-record-set-up-organisation).
- Answered: the web dashboard and chat come first. Editor panels and the operator console follow in later layers.

## Out of scope

- The cost and schedule view (REQ-workflow-6), which arrives with the business tools.
- Editor panels and the operator console.
- Connections to third-party tools.
