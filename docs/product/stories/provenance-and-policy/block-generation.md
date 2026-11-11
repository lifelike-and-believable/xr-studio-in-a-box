---
id: story-provenance-and-policy-block-generation
status: approved
derived-from:
  - epic-provenance-and-policy#outcome: c0bb4a44b0d6
  - persona-collaborator#goals: 72c41c51284f
---

# Block generation that breaks a term

As Robin, a collaborator, I want to have generation that breaks a term refused so that the pipeline refuses work that breaks what I agreed.

## Acceptance criteria

- A generation request that breaks a recorded term does not run.
- The person who asked is told which term blocked it.
- The block can be overridden only by a person who holds the contracts and licence terms approval, by recording a new or changed term with who did it and when. An agent cannot record or change a term.
- The refusal appears in the activity log.
