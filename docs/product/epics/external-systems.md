---
id: epic-external-systems
status: approved
derived-from:
  - requirements-showcontrol#REQ-showcontrol-3: 332f17063fa1
  - requirements-showcontrol#REQ-showcontrol-4: e09ab8918cf6
  - requirements-showcontrol#REQ-showcontrol-5: 5d838ec34d98
  - requirements-showcontrol#REQ-showcontrol-6: 45f398a32bd6
  - requirements-showcontrol#REQ-showcontrol-9: 64c6f7e2a58c
  - persona-show-operator#goals: 408315e4f8f6
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Work with the show systems a venue already has

<!-- Layer 4, show control. -->

## Outcome

A show can lead or follow external cue, lighting and audio systems through open protocols, or run with none of them, from whichever surface suits the operator.

## Personas

- persona-show-operator: keeps using familiar consoles and software.
- persona-technical-artist: tests integrations without the real hardware.

## Proposed stories

- Choose whether a show leads or follows, without a rebuild.
- Connect through OSC, MIDI and MIDI show control.
- Connect lighting through DMX over Art-Net or sACN, and PosiStageNet.
- Exchange video through NDI, Spout, SRT and SDI, with timecode.
- Run a show from a touchscreen, a control surface or a keyboard and mouse, or with no external systems.
- Test integrations against simulators or recorded sessions.

## Stories

- None yet.

## Release groups

- OSC and standalone running ship first.
- Each protocol can then ship on its own, in the order the first shows need.
- Simulators ship with each protocol.

## Dependencies

- epic-cue-list.

## Open questions

- Which external systems will the first show really use? Discovery leaves this open.
- Is a lighting desk leading Unreal, as RSC Dream did, the model to test first?

## Out of scope

- Product-specific profiles and Syphon, which follow later.
