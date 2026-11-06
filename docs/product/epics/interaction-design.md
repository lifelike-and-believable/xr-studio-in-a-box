---
id: epic-interaction-design
status: approved
derived-from:
  - requirements-interaction#REQ-interaction-1: 0bc1ec616864
  - requirements-interaction#REQ-interaction-2: 5e166bb9ecba
  - requirements-interaction#REQ-interaction-3: 6ee7841c8905
  - requirements-interaction#REQ-interaction-4: 89b0d1c63da9
  - requirements-interaction#REQ-interaction-5: 8804093cc153
  - requirements-interaction#REQ-interaction-6: 6350489b0711
  - persona-interaction-designer#goals: 59b8371fa6c9
  - persona-director#goals: a92ca172be83
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Design what guests can do, and try it early

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

A project can record what guests can do, try it in a playable prototype before art is final, map it to each target's input, and test it automatically.

## Personas

- persona-interaction-designer: owns this work from first sketch to tested interaction.
- persona-director: approves it at its gate.
- persona-technical-artist: builds what patterns cannot cover.

## Proposed stories

- Record what guests can do and what responds, as a reviewable design.
- Try an interaction in a playable prototype with placeholder art.
- Declare how guests move on each target.
- Map one interaction to each target's input, and say what replaces it where a target cannot support it.
- Save and configure a reusable interaction pattern without code.
- Run a scripted test of each interaction on each target.

## Stories

- None yet.

## Release groups

- The design record, the gate and the prototype ship first.
- Movement, input mapping and tests follow.
- Reusable patterns can ship once two shows need the same interaction.

## Dependencies

- epic-review-and-status.
- epic-cue-list, for interactions that fire cues.

## Open questions

- Who holds this role on small shows, the director or a technical artist? Quinn is mostly assumed.
- Which interactions are worth saving as the first patterns?

## Out of scope

- Avatars touching performers or each other, which is later (REQ-audience-9).
- Guest roles, which belong to epic-audience-avatars.
