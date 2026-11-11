---
id: story-shared-library-block-reuse
status: approved
derived-from:
  - epic-shared-library#outcome: 0f9866061bcc
  - persona-producer#goals: d1cc47b03be9
---

# Block reuse the terms do not allow, and say why

As Jordan, the producer, I want reuse that breaks an item's terms blocked, with the reason shown, so that I know what is blocked and why.

## Acceptance criteria

- When the terms check (story-shared-library-check-terms) finds a term that does not allow the reuse, the item does not come into the project.
- The person who asked is told, in plain words, which term blocked it, which collaborator or performer it belongs to, and which project it came from.
- For a chosen library item, Jordan can see whether the project can use it, and on what terms, or which term blocks it. Jordan sees only what Jordan's role allows.
- The block can be overridden only by a person who holds the contracts and licence terms approval, by recording a new or changed term with who did it and when, as in story-provenance-and-policy-block-generation. An agent cannot record or change a term.
- Each block appears in the activity log (story-agent-work-read-activity-log).
