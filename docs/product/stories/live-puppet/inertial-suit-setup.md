---
id: story-live-puppet-inertial-suit-setup
status: approved
derived-from:
  - epic-live-puppet#outcome: 4ad77042551f
  - persona-capture-crew#goals: a63bac7ade3c
---

# Set up and calibrate a portable inertial suit

As Casey, from the capture and technical crew, I want a guided setup and calibration for a portable inertial suit so that I can get the first capture source working without a pipeline engineer.

## Acceptance criteria

- Casey is guided step by step through connecting and calibrating the suit, with no code, command line or configuration files.
- Each step checks that it worked before the next one starts, and says what to fix if it did not.
- The performer is told each calibration pose both by voice and on a screen, and Casey can lead the steps for them, so the performer does not need to read a screen or use a keyboard.
- At the end, Casey sees a proxy character on the UE5 mannequin skeleton (Manny) follow the performer through the common interface (story-live-puppet-connect-a-source).
- The calibration is saved under the performer's name, and the next session can reuse it instead of calibrating from the start.
