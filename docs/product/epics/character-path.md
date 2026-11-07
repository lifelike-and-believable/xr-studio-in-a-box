---
id: epic-character-path
status: approved
derived-from:
  - requirements-content#REQ-content-1: 098798c84afd
  - requirements-content#REQ-content-2: c768c43c880f
  - requirements-content#REQ-content-3: f456f016edde
  - requirements-content#REQ-content-9: 21448ae55c03
  - requirements-content#REQ-content-15: 8da7c0dd776e
  - persona-artist#goals: 0767918db571
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-director#goals: a92ca172be83
---

# From a brief to a character a performer can drive

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

A character can go from a brief and references to a rigged, engine-ready asset, through reviewed stages, in any of the four styles, and be locked before performers rehearse with it.

## Personas

- persona-artist: gets to a strong first draft fast, and can work by hand in chosen tools.
- persona-technical-artist: keeps rigs on the common skeleton or an automatic retarget.
- persona-director: approves design, then mesh and rig, at their gates.

## Proposed stories

- Turn a brief and references into design drafts, and approve one at the design gate.
- Produce a mesh and rig from an approved design, and approve them at their gate.
- Bring a hand-made character or part into the path without an agent redoing it.
- Make a stylised, creature or abstract character through the same path as a human one.
- Put a character on the common skeleton, or retarget it automatically.
- Lock a character before rehearsal, with later changes needing a named person.

## Stories

- None yet.

## Release groups

- Design, mesh and rig ship together: this is the smallest complete path.
- Other styles follow one at a time, starting with whichever the first show needs.
- The lock can ship on its own, before the first rehearsal.

## Dependencies

- epic-review-and-status, for gates.
- epic-provenance-and-policy, for the policy gate and provenance record.
- epic-agent-work, for tool adapters.
- The common skeleton convention, which is decided in epic-live-puppet.

## Open questions

- Which generation tools come first? The research notes treat several as trials, and output licences are not all checked.
- Which character style does the first show need?

## Out of scope

- Transformation and hair, cloth and costume, which belong to epic-character-forms.
- Automatic asset checks, which belong to epic-asset-checks.
