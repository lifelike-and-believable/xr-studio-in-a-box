---
id: story-live-signals-depth-sensors
status: approved
derived-from:
  - epic-live-signals#outcome: e56c7244daf6
  - persona-capture-crew#goals: a63bac7ade3c
---

# Report guest presence from depth sensors

As Casey, the capture crew, I want to set up depth sensors that report guest presence as momentary points or skeletons so that presence sensors are set up and calibrated through a guided process.

## Acceptance criteria

- Casey can connect a depth sensor through a guided setup and calibration, set the area it watches, and see the momentary points or skeletons it reports.
- The sensor passes on only momentary points or skeletons. No camera or depth image, face or other feature that could identify anyone reaches the project, any output or any recording, and the test checks every output connected. Nothing is stored or backed up, and after a session no depth data is found in the project or its recordings.
- Presence can drive a channel or a scene value through a signal mapping (story-live-signals-map-a-signal), and the simulated crowd (story-live-signals-guest-presence) stands in for the sensor in tests and rehearsal. If the sensor drops (story-handover-and-fallback-automatic-switch), the values it drives use their fallback (story-handover-and-fallback-define-fallback).
- A depth sensor cannot be switched on for a show with guests until its notice to guests is recorded. The notice's content is defined by REQ-governance-7: the sensor reports only momentary points or skeletons, which are never stored and cannot identify anyone. A clear notice is given to guests rather than asking each guest's consent. A person who holds the audience-facing safety and consent approval approves the notice. An agent cannot approve it.
- Until the legal review of sensing (REQ-governance-7) is recorded for the show's region, the depth sensor is used only in tests with crew who know about it.
