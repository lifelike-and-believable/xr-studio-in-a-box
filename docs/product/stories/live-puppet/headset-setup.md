---
id: story-live-puppet-headset-setup
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Set up and calibrate a headset and hand controllers

As Casey, the capture crew, I want a guided setup and calibration for a headset and hand controllers so that a headset and hand controllers are set up and calibrated through a guided process.

## Acceptance criteria

- Casey is guided step by step through connecting and calibrating the headset and hand controllers, with no code, command line or configuration files.
- Each step checks that it worked before the next one starts, and says what to fix if it did not.
- The performer in the headset is told each step both by voice and in the headset view, so they do not need to take it off.
- At the end, Casey sees a proxy character on the UE5 mannequin skeleton (Manny) follow the performer through the common interface (story-live-puppet-connect-a-source).
- The calibration is saved under the performer's name, and the next session can reuse it.
