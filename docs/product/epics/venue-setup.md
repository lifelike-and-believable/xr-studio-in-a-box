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

- None yet.

## Release groups

- Offline running ships first: it is a design rule for all shows.
- The profile, fit check and alignment ship together.
- The headset list ships with the hardware chosen for UC-1.

## Dependencies

- epic-build-and-install.
- epic-session-operations.

## Open questions

- What hardware does UC-1 use? This also decides the headset list.
- How does a show model its staffing before that decision?
- What are the restart and takeover time targets? They are TBD.

## Out of scope

- Standalone headsets (REQ-delivery-9), which are later.
- Third-party LBVR platforms (REQ-delivery-22), which are later.
