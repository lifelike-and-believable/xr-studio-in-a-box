---
id: story-live-signals-beams
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-capture-crew#goals: a63bac7ade3c
---

# Report guest presence from beams

As Casey, the capture crew, I want to set up beam sensors that report guest presence so that presence sensors are set up and calibrated through a guided process.

## Acceptance criteria

- Casey can connect beam sensors through a guided setup and calibration, name the line each beam or pair of beams guards, and see when a guest crosses each line, and in which direction where a pair of beams allows it.
- The simulated crowd (story-live-signals-guest-presence) stands in for the beams in tests and rehearsal and drives the same values.
- Presence can drive a channel or a scene value through a signal mapping (story-live-signals-map-a-signal). If a beam drops (story-handover-and-fallback-automatic-switch), the values it drives use their fallback (story-handover-and-fallback-define-fallback).
- Presence data is used live only. It is not recorded, stored or backed up. After a session, no presence data is found in the project or its recordings.
- Beams cannot be switched on for a show with guests until a person who holds the audience-facing safety and consent approval records that the legal review of sensing (REQ-governance-7) is done for the show's region. An agent cannot record it. Tests and rehearsals with no guests are not blocked.
