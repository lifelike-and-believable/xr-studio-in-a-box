---
id: story-project-record-back-up-and-restore
status: approved
derived-from:
  - epic-project-record#outcome: c7917e3ef44b
  - persona-producer#goals: d1cc47b03be9
---

# Back up and restore a project

As Jordan, the producer, I want to back up a project and restore an earlier version so that the records the production depends on are never lost.

## Acceptance criteria

- A project, including its large binary assets, is backed up without Jordan having to remember to do it.
- Jordan can see when the last backup finished, and whether it succeeded.
- Jordan can restore the project to an earlier version and see what it contains.
- A restore has been tested on a real project before real work relies on it.
- Guest data is not in the backup.
