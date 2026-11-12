---
id: story-agent-work-agent-permissions
status: approved
derived-from:
  - epic-agent-work#outcome: f707c8c84ba0
  - persona-director#goals: a92ca172be83
---

# Limit what an agent can reach

As Morgan, the director, I want each agent to reach only the projects, tools and folders its task needs so that the approvals that never go to an AI stay with people.

## Acceptance criteria

- A person with the right role can grant an agent chosen projects, tools and folders, and the grant is recorded.
- An agent told to reach anything else is refused, and the refusal appears in the log.
- An agent cannot delete or overwrite approved work, change roles or limits, change the policy record or the no-term choice, or send anything outside the project without a person's approval. The model provider the agents run on counts as inside the project, and so do the project's own hosting, storage, backup and email providers. Granting an agent a tool approves sending that tool's inputs to its vendor. Sending email, publishing and uploading anywhere else need a person's approval each time.
