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
- Exchange video through NDI, and LTC timecode.
- Run a show from a touchscreen, a control surface or a keyboard and mouse, or with no external systems.
- Test the lighting-desk path against simulators or recorded sessions.
- Exchange video through Spout.
- Exchange video through SRT and SDI.
- Send and receive MIDI timecode.
- Test the other protocols (MIDI notes and controllers, PosiStageNet, MIDI timecode) against simulators.
- Test video streams (NDI, Spout, SRT and SDI) against simulators.

## Stories

- story-external-systems-lead-or-follow
- story-external-systems-osc-midi-msc
- story-external-systems-lighting
- story-external-systems-video-and-timecode
- story-external-systems-surfaces-and-standalone
- story-external-systems-simulators
- story-external-systems-spout
- story-external-systems-midi-timecode
- story-external-systems-other-simulators

## Release groups

- OSC and standalone running ship first.
- Each protocol can then ship on its own, in the order the first shows need.
- Simulators ship with each protocol.

## Dependencies

- epic-cue-list.

## Open questions

- Answered: a lighting desk first (approver's answer). The rest is settled in story-external-systems-lead-or-follow: before the first show's venue is chosen, the director or their delegate records the external systems each candidate venue has, each venue profile (story-venue-setup-venue-profile) is checked against that list, and further protocols are built and tested in the order it needs.
- Answered: yes. A lighting desk leading Unreal, as on RSC Dream, is tested first: the desk fires cues in Unreal over OSC or MIDI show control, and timecode follows (approver's answer). See story-external-systems-lead-or-follow and story-external-systems-osc-midi-msc.

## Out of scope

- Product-specific profiles and Syphon, which follow later.
