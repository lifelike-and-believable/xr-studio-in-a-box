---
id: epic-agent-work
status: approved
derived-from:
  - requirements-workflow#REQ-workflow-8: b88f0f5a9d77
  - requirements-workflow#REQ-workflow-10: 8790289dc6a1
  - requirements-workflow#REQ-workflow-11: 284becfd73f8
  - requirements-workflow#REQ-workflow-13: 8c613ceced18
  - requirements-workflow#REQ-workflow-14: 2f079aa70315
  - persona-director#goals: a92ca172be83
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
---

# Direct agents safely

<!-- Layer 1, project backbone. -->

## Outcome

A person can direct agents in conversation and trust the limits: each agent reaches only what it was granted, every action is logged, and spend stops at the project's limit. A technical artist can add a tool or workflow step without changing the core.

## Personas

- persona-director: directs the work by conversation, and needs to know what was done in the project's name.
- persona-technical-artist: extends the workflow and replaces tools.
- persona-producer: needs metered spend to stop before it passes the limit.

## Proposed stories

- Direct an agent in conversation on a project task.
- Read an activity log that names the project, stage, tool and the person who requested or approved each action.
- Grant an agent access to chosen projects, tools and folders, and see that it cannot delete approved work, change roles or limits, or send anything outside the project.
- Set a spend limit, with metered work blocked until one is set, and have an agent stop and ask when a request would pass it.
- Add a workflow step, integration or check without modifying the core, versioned and reviewed like other work.
- Reach an external tool through an adapter, and replace it without rewriting the workflow.

## Stories

- story-agent-work-direct-an-agent
- story-agent-work-read-activity-log
- story-agent-work-agent-permissions
- story-agent-work-spend-limit
- story-agent-work-extend-the-workflow
- story-agent-work-tool-adapter

## Release groups

- Conversation, the activity log and agent permissions ship together: agents do not run on real projects without them.
- The spend limit ships before any metered generation tool is connected.
- Extension and adapters can ship together, after the others.

## Dependencies

- epic-project-record, for projects and roles.
- epic-review-and-status, because agent output goes to the review queue.
- epic-provenance-and-policy, before any generative tool runs.

## Open questions

- Answered: a new project has no default spend limit. Metered work stays blocked until a person sets one.
- Answered: Tripo is the first adapter. Replacing it with another generator tests the pattern.

## Out of scope

- Show-mode behaviour on reaching a limit, which arrives with fallbacks in later layers.
- Keeping agents out of the live path and the switch between modes (REQ-workflow-9, REQ-workflow-12), which belong to the show control layer.
- The brief-to-build workflow (REQ-workflow-1), which needs the content and delivery layers.
