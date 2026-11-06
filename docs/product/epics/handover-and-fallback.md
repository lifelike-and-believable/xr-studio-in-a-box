---
id: epic-handover-and-fallback
status: approved
derived-from:
  - requirements-performance#REQ-performance-3: 9fef3f0aaf37
  - requirements-performance#REQ-performance-4: 44767017965b
  - requirements-performance#REQ-performance-6: d3dad6ac18dc
  - requirements-performance#REQ-performance-14: 129c12ce401a
  - persona-performer#goals: 9de25c7bbe59
  - persona-capture-crew#goals: a63bac7ade3c
---

# Nothing breaks when a source changes or fails

<!-- Layer 2, live puppetry. -->

## Outcome

Control of a channel can move between sources with no visible jump, and if a source drops, the channel falls back by itself and the performer is told without breaking character.

## Personas

- persona-performer: stays in character whatever happens, and knows when something has changed.
- persona-capture-crew: can swap a failed device without stopping the session.

## Proposed stories

- Define a fallback for each channel: another source, a recording or loop, an AI-held pose or a safe hold.
- Switch to the fallback automatically when a source drops.
- Tell the performer about a fallback through a signal they can perceive while performing.
- Hand a channel to another driver by blend, pose match or cover, with a default blend so a hard cut cannot happen by accident.
- Trigger a handover from a performer control or a cue.
- Return a recovered source to its channel without a visible jump.
- Set a legibility bar for a channel, such as hands for signing, and tell the audience and performer if it is broken, with no AI motion filling the gap.

## Stories

- None yet.

## Release groups

- Fallback definition, automatic switch and the performer's signal ship together: a silent fallback leaves the performer unaware.
- The handover methods and their triggers ship together.
- The legibility bar can ship on its own, after fallbacks exist.

## Dependencies

- epic-live-puppet.

## Open questions

- What signal works for a performer in a headset, and for one in a suit with no headset? It cannot rely on sound or sight alone (REQ-workflow-18), and this needs trying with a real performer.
- How is legibility measured? This needs Deaf performers and viewers to set the bar.
- What is the target time to switch? The requirement sets it from rehearsal results, so the first device-failure tests must happen in this epic.

## Out of scope

- Handing a performer's channel to AI mid-scene (REQ-characters-11), which is later.
- The operator's routing control (REQ-showcontrol-16), which belongs to the show control layer.
- The full device health view, which is later.
