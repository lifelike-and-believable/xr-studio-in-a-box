---
id: story-session-operations-live-trim
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-capture-crew#goals: a63bac7ade3c
---

# Trim alignment or calibration during a session

As Casey, the capture crew, I want to apply a small offset to alignment or a source's calibration while the show runs so that each capture source stays set up and calibrated without stopping the session.

## Acceptance criteria

- During a session, Casey, or the show's operator, can apply a manual offset to the alignment of the virtual world with the room or stage, or to a capture source's calibration, in position and rotation. The show does not stop or restart, and the result is seen at once.
- Each offset stays within a range Casey sets for it in production mode. Casey can undo the last offset in one step.
- A trim in show mode is a change during a live run (story-session-operations-live-changes) and follows its rules, including the log of who made it and the old and new values. An agent cannot trim.
- The cue list can mark offstage moments for a performer to recalibrate (story-cue-list-build-a-cue-list). At such a moment, Casey can run the source's guided calibration (story-live-puppet-inertial-suit-setup) while the rest of the show runs, and the performer is told when it starts and ends on the crew channel (story-performer-support-crew-channel).
- Until venue alignment arrives with epic-venue-setup in Layer 5, alignment trims are tested against a saved test alignment of a proxy level. Calibration trims are tested with the portable inertial suit and a real performer.
- Trims work with every agent and the internet disconnected.
