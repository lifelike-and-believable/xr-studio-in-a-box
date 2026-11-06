---
id: requirements-workflow
status: approved
derived-from:
  - concept#vision: 3e44665fdea8
---

# Workflow and orchestration requirements

<!-- Source: docs/product/discovery/use-cases.md sections 1, 2, 12, 14, 15. Values marked TBD need the approver. -->

## Terms

These terms apply in all requirements files.

- **Project:** a production as a whole.
- **Show:** the authored work, with its cue list, characters and rules.
- **Session:** one run of a show for an audience, such as a group's slot, a livestream or one visitor's turn at an installation.

## REQ-workflow-1: Brief to build

Given a brief, the workflow produces a running, tested build by passing through defined stages. Each stage's output is stored, named and reviewable. In the first release, "tested" means automatic checks only: asset checks, a successful build, scripted scenarios, and performance measurements against the target's budget all pass. A person reviews the result afterwards at the gate. A rehearsal with people is a separate step, not part of "tested".

## REQ-workflow-2: Review gates

Each hand-off in the gate list below waits for approval from a person named for that project and area. Hand-offs not listed proceed without waiting. Agents work freely inside a stage. Every gate is approved by a person, never by an AI. An AI reviewer may pre-check an item and recommend a result, and its recommendation is marked as such. The four kinds of approval in REQ-workflow-7 also have a stricter rule on who may hold them.

| Area | Gated hand-offs |
|---|---|
| Creative | Look and concept art; character design; mesh and rig; environments; visual effects; sound and music; interaction design |
| Performance and behaviour | Motion and performance quality; AI behaviour, voice and dialogue; cue list; audience-facing safety and consent |
| Builds and operations | Build for a public show; update to a remote venue; changes during a live run |
| Business | Funding applications and reports; contracts and licence terms; spend above a limit; publishing and marketing; AI-use statements and credits |

A build for rehearsal is not gated.

## REQ-workflow-3: Iteration with history

Any stage output can be revised with written feedback and regenerated. Earlier versions are kept and can be compared side by side and restored.

## REQ-workflow-4: Review queue

All pending approvals appear in one queue. Each item shows a preview, the stage, the requester and what changed. A reviewer can accept, request revision, or reject, singly or in a batch.

## REQ-workflow-5: Status board

For each project the board shows every stage and asset, its owner, and its state (in progress, waiting for review, blocked, done).

## REQ-workflow-6: Cost and schedule view

For each project the tools show budget against actual cost, including generation, cloud and per-show running costs, and the production schedule.

## REQ-workflow-7: Per-project roles and delegates

Each project assigns roles and names approvers and delegates per area. A new person can be given a role without writing code or editing configuration files by hand. Four kinds of approval may be delegated only to a named, dedicated team member and never to an AI: contracts and licence terms; funding applications and reports; publishing and marketing; audience-facing safety and consent. The project records who holds each of these.

## REQ-workflow-8: Direct by conversation

A person can direct the agents in conversation. Every agent action is recorded in an activity log that names the project, stage, tool, and the person who requested or approved it.

## REQ-workflow-9: Agents out of the live path

In show mode, no live function (cues, routing, fallbacks, outputs) depends on an agent being available or responsive. Losing every agent mid-show does not stop the show.

## REQ-workflow-10: Extensible by technical users

Technical artists and pipeline engineers can add or change workflow steps, integrations and checks without modifying the core. Changes are versioned and reviewed like other project work.

## REQ-workflow-11: Replaceable tools

Each external tool (generation, modelling, capture, engine plugins) is used through an adapter, so one tool can be replaced without rewriting the workflow that uses it.

## REQ-workflow-12: Two modes

Production mode (flexible, review-centred) and show mode (reliable, low-latency, offline-capable) are distinct. Switching between them is explicit and recorded.

## REQ-workflow-13: Spend-limit enforcement

Each project has a spend limit for generation, cloud and other metered cost. When a request would take spend past the limit, the agent stops and asks a person with the right role. In show mode, reaching the limit never stops the show: the affected service switches to its fallback (REQ-characters-5) and the operator is told. The limit's value is set per project (TBD).

## REQ-workflow-14: Agent permissions

Each agent can reach only the projects, tools and folders granted for its task. It cannot delete or overwrite approved work, change roles or limits, or send anything outside the project without a person's approval. Grants are recorded.

## REQ-workflow-15: Notifications

People are told when something waits for them, by the channel they choose, with a short summary and a link to the item. Notifications can be grouped so that a reviewer is not interrupted for each item.

## REQ-workflow-16: Backup and version control

Project state and large binary assets (models, textures, levels, captures) are versioned, recoverable to an earlier version, and backed up. Recovery is tested.

## REQ-workflow-17: One set of facts, several surfaces

People work through four surfaces: panels inside the Unreal Editor, a web dashboard, chat with the agent, and a dedicated operator console. All of them show the same project state. Each person sees only what their role needs.

## REQ-workflow-18: Accessible tools

The web and operator tools meet WCAG 2.2 AA. Signals to performers, operators and crew never rely on sound or sight alone.

## Constraints

- In all requirements files, a requirement marked (later) is not in the first release. All others are.

- Unreal Engine is the engine (concept, non-goals).
- What performers, operators and the venue audience need at show time runs on the venue network without internet (see REQ-delivery-5).
- Artists, sound designers, performers, operators and attendants must not need code or the command line.

## Success measures

- Time from brief to first reviewable build. The target is set after a baseline is measured on the first project.
- On-site and rehearsal hours, tracked on the first project, because much of a production's trouble happens at the venue.
