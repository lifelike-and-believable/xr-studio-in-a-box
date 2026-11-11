---
id: story-environment-path-bring-hand-made-work
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-artist#goals: 0767918db571
---

# Bring hand-made environment work into the path

As Riley, the artist, I want to bring environment work made in my own tools into a level so that I keep working in my chosen tools and the results come back without agents redoing them.

## Acceptance criteria

- Riley can bring work from Blender or another tool into a level in a standard interchange format, such as FBX, glTF or USD, without code.
- Agents do not redo imported work. An agent revision of the level leaves it as Riley made it unless Riley asks for a change.
- The provenance record (story-provenance-and-policy-provenance-record) shows the work as made by hand, by Riley, with no AI use.
- Imported work goes through the same asset checks (epic-asset-checks) and the same gate as generated work.
- Riley can bring in a changed version of the same work. It becomes a new version, and the earlier one is kept (story-review-and-status-feedback-and-versions).
