---
id: epic-character-forms
status: approved
derived-from:
  - requirements-content#REQ-content-4: 5c8a43b68bfc
  - requirements-content#REQ-content-10: b6b1330a2285
  - persona-artist#goals: 0767918db571
  - persona-technical-artist#goals: 1fb2055dfdf2
  - persona-performer#goals: 9de25c7bbe59
---

# Characters that change form and move well on every device

<!-- Layer 3, character, environment and asset paths. -->

## Outcome

A character can change form during a show through a rehearsable cue, and its hair, cloth and costume are authored once and scaled per device.

## Personas

- persona-artist: makes each form as a reviewed asset.
- persona-technical-artist: makes transitions reliable, and scales simulation per target.
- persona-performer: can trigger or drive a change live.

## Proposed stories

- Morph a character between two reviewed forms.
- Swap a character behind an effect.
- Dissolve and reassemble a character.
- Change a character continuously while a performer drives it, such as growing or shrinking.
- Author hair, cloth and costume once, simulated live on PC and simplified on weaker targets.

## Stories

- None yet.

## Release groups

- Morph and swap ship first, because they cover most show needs.
- Dissolve and continuous change can each ship on their own.
- Hair, cloth and costume can ship on their own.

## Dependencies

- epic-character-path.
- epic-effects-path, for swaps behind an effect.
- epic-cue-list, for transitions as cues.

## Open questions

- Which kind of transformation does the first show need?
- How much live cloth simulation fits inside the performer delay target?

## Out of scope

- Handing a character to AI during a change, which is later (REQ-characters-11).
