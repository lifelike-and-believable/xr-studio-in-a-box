---
id: story-venue-setup-venue-profile
status: approved
derived-from:
  - epic-venue-setup#outcome: a0070cbdbc62
  - persona-show-operator#goals: 408315e4f8f6
---

# Save a venue profile, and connect the venue's fire alarm

As Alex, the show operator, I want each venue to have a saved profile of its space, outputs, network and alarm, checked before each show, so that I know before doors open that the outputs and links are ready.

## Acceptance criteria

- A venue profile is a saved record of a venue's space (floor plan, size and height), boundaries, obstacles, outputs (each projector, screen, headset area and sound system, with each surface's geometry, mirroring and brightness, REQ-delivery-17), network (the venue network, the show machines on it and whether internet is available), its external systems (story-external-systems-lead-or-follow), and its alarm interface. This story defines a venue profile. Other stories refer to it by this story's id.
- Casey, or another person whose role allows it, makes and edits a profile in production mode (story-show-safety-switch-modes) through a guided form with no code, from measurements in the room. Each change makes a new dated version that names who made it, and a later show at the same venue can use it. An agent can draft a profile from a floor plan or notes, but a person confirms each value before it is used. An agent cannot confirm a value. Only people whose role needs it can see the network details.
- The profile records how the venue's fire alarm signals, such as a relay contact or a network message. Casey connects it to the emergency stop's fire-alarm input (story-show-safety-emergency-stop) as an integration added without modifying the core (story-agent-work-extend-the-workflow). The connection is tested at the venue with the venue's own alarm test signal, as the venue's staff allow: every session of the show reaches its safe state, and the time from the alarm signal to the safe state is measured against the emergency stop's target. This story defines connecting a venue's alarm interface. Other stories refer to it by this story's id.
- If a venue has no alarm interface the show can use, the profile says so in text, and the holder of the audience-facing safety and consent approval (story-project-record-name-approvers) records how a fire alarm is handled instead, such as Alex pressing the stop, before a public show there. An agent cannot record it.
- The pre-show check (story-session-operations-pre-show-check) confirms that the show uses the current version of the profile, that the outputs and network are as the profile says, and that the alarm input is connected. Alex sees each difference in plain words.
- The story is tested with the first release's PC VR and projection kit in a room profiled for the test, with the internet disconnected, and with a test alarm signal where the room has no alarm interface.
