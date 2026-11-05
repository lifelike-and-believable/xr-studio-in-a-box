---
id: requirements-governance
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Governance, provenance and consent requirements

<!-- Source: discovery sections 8, 11, 12, 14. Legal terms below need review per jurisdiction. -->

## REQ-governance-1: Project policy record

Each project has a policy record listing its collaborators and the terms agreed with each, including limits on AI use, cultural protocols and rights restrictions. Terms can be added and changed with a dated history.

## REQ-governance-2: Policy gate on generation

Before any generative tool runs, the workflow checks the project's policy record. If the request is not allowed, it does not run and states which term blocks it. A person with the right role can override only by recording a new or changed term. If a collaborator has recorded no AI term, each project chooses what the gate does: block, allow internal drafts only (nothing reaches an audience), or allow with a warning. Until a project chooses, the gate blocks (confirmed by the approver).

## REQ-governance-3: Minimum provenance record

Every asset carries a record from the day it enters the project: its source, the tool and version, the date, whether AI was used, the person who approved it, and the policy terms in force. It also holds the prompts and settings used, a copy or reference of the generating tool's licence terms on the date of use, a record of what a person changed after generation, and the reference inputs fed to the tool with their owners and terms. Prompts and reference inputs can be sensitive, so access to them is restricted by role. The record travels with the asset when it is reused in another project.

## REQ-governance-4: Quality and licence gate

No generated asset enters a project until it passes the project's quality checks and its licence status is recorded.

## REQ-governance-5: Cultural and rights sign-off

Where the policy record calls for a collaborator's sign-off (for example a cultural consultant), the named stages wait for it. The sign-off is recorded with who gave it and when.

## REQ-governance-6: Collaborator access

Collaborators and funders can be given limited access to review and sign off specific items, without access to the rest of the project.

## REQ-governance-7: Likeness and voice consent

A guest's likeness, voice or body data is captured or stored only after consent is recorded for that show. By default, this data is used live only and is deleted when the show ends. Keeping it longer, for example for a later show, needs a separate opt-in from the guest. Each show declares what is kept, for how long, and where it is processed. Data can be deleted on request. Guest data is kept out of project backups (REQ-workflow-16), so deletion is complete. The consent record itself is kept (REQ-business-17). Shows with guest data in Canada, the United States, the UK or EU, and Japan or elsewhere in Asia each need legal review of the applicable privacy and biometric rules before they run (pending; this is not legal advice).

## REQ-governance-8: Reuse keeps terms

When an asset, character or environment is reused, the terms of its original project are shown and checked against the new project's policy record.

## REQ-governance-9: Performer consent

Each performer's agreement is recorded per project: what may be captured (body, face, voice, motion) and how it may be used, including AI uses such as training, synthesis, transformation, continuing a performance in the performer's style (REQ-characters-11), or driving a character after the performance. The policy gate (REQ-governance-2) checks this record before a generative tool uses a performer's data, and each asset derived from it names the performer in its provenance record. A performer's agreement can be changed, with a dated history. By default, assets the new agreement no longer allows are flagged and cannot be used in new work or new shows. Past shows and work already delivered stand as they are. A contract can set different terms. This default needs legal review (pending; this is not legal advice).

## Constraints

- Permission to use AI differs by collaborator and is negotiated case by case.
- Face, voice and body data can be biometric in some jurisdictions.

## Success measures

- No asset in a production build lacks a provenance record.
- No generation request runs against a policy that forbids it.
