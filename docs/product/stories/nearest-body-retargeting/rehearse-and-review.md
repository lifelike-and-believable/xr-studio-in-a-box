---
id: story-nearest-body-retargeting-rehearse-and-review
status: approved
derived-from:
  - epic-nearest-body-retargeting#outcome: 49852e3af6be
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Rehearse a retargeted mapping and send it for review

As Sam, the technical artist, I want to rehearse a retargeted mapping on a proxy character and send it for review so that I can set up retargeting for a body that does not match the performer's and have it approved before a show uses it.

## Acceptance criteria

- In production mode, Sam can play a performer's motion through a retargeted mapping (story-nearest-body-retargeting-correct-and-save) onto a proxy character: a live performer whose agreement is confirmed, or a recording whose performer's agreement allows replay in rehearsal (story-session-recording-record-agreement).
- While the motion plays, Sam can change the mapping and see the result with no new build or restart. Each saved change is a new version of the mapping.
- Sam can send a version for review. The review item shows a preview of the proxy character driven by the motion, the body plan, and which matches are automatic and which were made by hand.
- Only the approved version runs in show mode. A newer version that is not yet approved does not replace it, and in show mode the mapping follows the rules in story-shared-characters-map-a-different-body.
