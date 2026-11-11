---
id: story-live-signals-guest-presence
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-capture-crew#goals: a63bac7ade3c
---

# Report guest presence from sensors

As Casey, the capture crew, I want to set up floor pads, beams or depth sensors that report guest presence, with a simulated crowd for testing so that presence sensors are set up and calibrated through a guided process and can be rehearsed without guests.

## Acceptance criteria

- Casey can connect floor pads, beams or a depth sensor through a guided setup and calibration, and see which zones report a guest present.
- A simulated crowd, with a number of guests and paths that a person sets, stands in for the sensors in tests and rehearsal and drives the same values.
- Presence can drive a channel or a scene value through a signal mapping (story-live-signals-map-a-signal). If a sensor drops, the values it drives use their fallback (story-live-signals-signal-fallback).
- Presence data is used live only. It is not recorded, stored or backed up, and depth data reaches the show only as momentary points or skeletons that cannot identify anyone (REQ-governance-7). After a session, no presence data is found in the project or its recordings.
- Real sensors cannot be switched on for a show with guests until a person with the right role records that the legal review of sensing (REQ-governance-7) is done for the show's region. An agent cannot record it. Tests and rehearsals with no guests are not blocked.
