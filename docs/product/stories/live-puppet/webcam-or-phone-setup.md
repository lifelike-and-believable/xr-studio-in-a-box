---
id: story-live-puppet-webcam-or-phone-setup
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Set up and calibrate webcam or phone capture

As Casey, from the capture and technical crew, I want a guided setup and calibration for webcam or phone capture so that a performer with no capture hardware can drive a character.

## Acceptance criteria

- Casey is guided step by step through connecting and calibrating a webcam or phone, with no code, command line or configuration files.
- The setup checks the camera's view, light and distance, and says what to change if the performer cannot be tracked.
- The performer is told each calibration pose both by voice and on a screen, and Casey can lead the steps for them.
- At the end, Casey sees a proxy character on the UE5 mannequin skeleton (Manny) follow the performer through the common interface (story-live-puppet-connect-a-source), and sees which channels the camera can drive.
- The calibration is saved under the performer's name, and the next session can reuse it.
