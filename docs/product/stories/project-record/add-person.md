---
id: story-project-record-add-person
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - persona-producer#goals: d1cc47b03be9
---

# Add a person with a role

As Jordan, the producer, I want to add someone to a project and give them a role so that new people can start quickly without technical help.

## Acceptance criteria

- Jordan can add a person and choose their role from the dashboard, with no code or configuration files.
- The new person can open the project and sees only what their role needs.
- Jordan can change or remove a role, and the change takes effect the next time that person acts.
- The project shows who is on it and in what role.
- The roles are director, producer, technical artist, artist, sound designer, interaction designer, capture crew, show operator, venue attendant, performer and collaborator. Before choosing a role, Jordan sees in text what it may see and do. This story defines the roles. Other stories refer to them by this story's id. Holding a role never gives one of the four protected approvals, which are named separately (story-project-record-name-approvers).
- Jordan can give one person more than one role on a project, such as capture crew and sound designer, and that person can see and do what any of their roles allows. An agent cannot add a person or give, change or remove a role.
