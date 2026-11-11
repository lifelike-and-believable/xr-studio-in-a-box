---
id: epic-venue-setup
status: approved
derived-from:
  - requirements-delivery#REQ-delivery-5: 05539771ad75
  - requirements-delivery#REQ-delivery-13: abc6240f8e34
  - requirements-delivery#REQ-delivery-14: 776ff9b1f77e
  - requirements-delivery#REQ-delivery-19: 60de990aaaed
  - persona-capture-crew#goals: a63bac7ade3c
  - persona-venue-attendant#goals: ee33f70fd41e
  - persona-show-operator#goals: 408315e4f8f6
---

# Set up in a venue, and keep running there

<!-- Layer 5, delivery. -->

## Outcome

A venue has a saved profile, a show knows whether it fits, the virtual world lines up with the room, everything needed runs with no internet, and a failed machine has a tested plan.

## Personas

- persona-capture-crew: aligns the world with the room.
- persona-venue-attendant: manages headsets from a plain list.
- persona-show-operator: trusts the show with no internet.

## Proposed stories

- Save a venue profile of its space, boundaries, obstacles, outputs and network.
- Declare the space a show needs, and check whether a venue fits.
- Align the virtual world with a room or stage, and save it for that venue.
- Run a full show on the venue network with the internet disconnected.
- Choose and test a plan for a failed show machine.
- See a plain headset list, and open a live view of one guest's headset.

## Stories

- story-venue-setup-venue-profile
- story-venue-setup-fit-check
- story-venue-setup-align-to-room
- story-venue-setup-offline-show
- story-venue-setup-failed-machine-plan
- story-venue-setup-headset-list

## Release groups

- Offline running ships first: it is a design rule for all shows.
- The profile, fit check and alignment ship together.
- The headset list ships with the hardware chosen for UC-1.

## Dependencies

- epic-build-and-install.
- epic-session-operations.

## Open questions

- Answered: venue stories are written and tested against the first release's PC VR and projection kit. Standalone headsets and UC-1's touring kit get a separate epic once the hardware is chosen. The headset list is written for PC VR headsets, including wireless PC VR, in story-venue-setup-headset-list.
- Answered: staffing is modelled per show from roles and counts the director or their delegate sets, in story-venue-setup-fit-check.
- Answered: restart and takeover time targets are measured in rehearsal and set by the director or their delegate, in story-venue-setup-failed-machine-plan.

## Out of scope

- Standalone headsets (REQ-delivery-9) and UC-1's touring kit, which get a separate epic once the hardware is chosen.
- Third-party LBVR platforms (REQ-delivery-22), which are later.
