---
id: epic-shared-library
status: approved
derived-from:
  - requirements-content#REQ-content-8: bc8c40b9f689
  - requirements-governance#REQ-governance-8: 6642ad31666d
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-producer#goals: d1cc47b03be9
  - persona-collaborator#goals: 72c41c51284f
---

# Reuse work across projects, with its terms intact

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

Characters, rigs, environments and cue structures can be saved and reused in new projects, and their original terms are shown and checked against the new project.

## Personas

- persona-technical-artist: stops rebuilding the same things.
- persona-producer: sees what can be reused, and on what terms.
- persona-collaborator: knows that terms follow the work.

## Proposed stories

- Save an asset or cue structure to the shared library, with its provenance.
- Bring a library item into a new project.
- Check its original terms against the new project's policy record.
- Block reuse the terms do not allow, and say why.

## Stories

- None yet.

## Release groups

- Saving, reuse and the terms check ship together: reuse without the check would break agreed terms.

## Dependencies

- epic-provenance-and-policy.
- epic-character-path.

## Open questions

- Is the library one store for all projects, or per organisation?

## Out of scope

- The full view for browsing the library, which comes later.
