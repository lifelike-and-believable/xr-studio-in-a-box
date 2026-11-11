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

- story-interaction-design-record-design
- story-interaction-design-playable-prototype
- story-interaction-design-guest-movement
- story-interaction-design-input-per-target
- story-interaction-design-reusable-pattern
- story-interaction-design-scripted-tests

## Release groups

- The design record, the gate and the prototype ship first.
- Movement, input mapping and tests follow.
- Reusable patterns ship with the first pattern, presence or action triggering a response. Further patterns ship once two shows need the same interaction.

## Dependencies

- epic-review-and-status.
- epic-cue-list, for interactions that fire cues.
- epic-shared-library, for saving patterns.

## Open questions

- Answered: on a small show the director holds the interaction designer's role unless the project names someone else, and a technical artist can be named for the build side (approver's answer). See story-interaction-design-record-design.
- Answered: the first pattern is one the first show (UC-2) needs: a guest's presence or a performer's action triggers a response in the world (approver's answer). Viewpoint choice comes later (REQ-audience-7). Grabbing, using and following a guide are saved once two shows need them. See story-interaction-design-reusable-pattern.

## Out of scope

- Avatars touching performers or each other, which is later (REQ-audience-9).
- Guest roles, which belong to epic-audience-avatars.
