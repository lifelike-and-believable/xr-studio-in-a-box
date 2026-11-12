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

- A generation request that breaks a recorded term does not run. The check runs at every tool adapter (story-agent-work-tool-adapter). Work generated in a tool outside the pipeline is checked against the terms when it is brought in (story-character-path-own-tool-generated-work), and an import check lists assets with no provenance record for the holder of the contracts and licence terms approval.
- The person who asked is told which term blocked it.
- A request whose inputs (a reference image, a sketch, a recording) are covered by a term that calls for the collaborator's sign-off before use waits and does not run. The item goes to that collaborator's limited page (story-provenance-and-policy-collaborator-sign-off), and the person who asked is told it is waiting and for whom. It runs only after the collaborator signs off. If they decline, it does not run.
- The block can be overridden only by a person who holds the contracts and licence terms approval, by recording a new or changed term with who did it and when. An agent cannot record or change a term.
- The refusal appears in the activity log.
