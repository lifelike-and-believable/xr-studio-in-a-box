---
id: epic-crowds-and-creatures
status: approved
derived-from:
  - requirements-characters#REQ-characters-1: 42afc0a74caf
  - requirements-characters#REQ-characters-2: 8fba453ee07e
  - requirements-characters#REQ-characters-3: 162c134de577
  - requirements-characters#REQ-characters-10: 6c8cb3fe8ff4
  - requirements-characters#REQ-characters-12: 67af34ce966a
  - persona-director#goals: a92ca172be83
  - persona-performer#goals: 9de25c7bbe59
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Crowds and creatures that fill the world

<!-- Layer 7, AI assists, crowds and creatures. -->

## Outcome

Autonomous crowds and creatures fill a scene, respond to cues, performers and nearby presence, can be conducted live, and AI can support a performer-led character.

## Personas

- persona-director: chooses what is locked and what is free.
- persona-performer: can conduct a crowd as one instrument, and switch AI help off.
- persona-technical-artist: tunes behaviours.

## Proposed stories

- Place a crowd in a scene, and choose and tune its behaviours.
- Add autonomous creatures that react to cues and performers.
- Conduct a crowd or creature directly as one instrument.
- Add secondary motion and fill undriven channels with AI, with a switch for the performer.
- Mark a moment as locked or free.
- React to a nearby presence with non-verbal, rule-based behaviour, with nothing kept.

## Stories

- None yet.

## Release groups

- Crowds and cue response ship first.
- Creatures and conducting follow.
- Locked and free moments ship with them.
- Presence reaction follows epic-live-signals, and public use waits on legal review.

## Dependencies

- epic-character-path.
- epic-cue-list.
- epic-behaviour-and-limits.
- epic-live-signals, for presence.

## Open questions

- What are the maximum counts per target? REQ-characters-1 leaves them TBD.
- Do rule-based methods do enough, so that no generative model is needed at show time?

## Out of scope

- Conversation, and reactions to identified guests (REQ-characters-9), which are later.
- AI takeover from a performer (REQ-characters-11), which is later.
