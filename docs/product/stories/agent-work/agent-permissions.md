---
id: story-agent-work-agent-permissions
status: approved
derived-from:
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Limit what an agent can reach

As Sam, the technical artist, I want to grant an agent only the projects, tools and folders its task needs so that a mistake cannot damage approved work.

## Acceptance criteria

- Sam can grant an agent chosen projects, tools and folders, and the grant is recorded.
- An agent told to reach anything else is refused, and the refusal appears in the log.
- An agent cannot delete or overwrite approved work, change roles or limits, or send anything outside the project without a person's approval.
