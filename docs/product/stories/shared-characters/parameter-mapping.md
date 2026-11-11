---
id: story-shared-characters-parameter-mapping
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Map motion onto character values

As Sam, the technical artist, I want to map a performer's motion onto character values such as energy, size or colour (parameter mapping) so that I can set up capture mappings for characters whose bodies do not match the performer's.

## Acceptance criteria

- Sam can choose a motion value from a performer's capture, such as the speed of a hand, the height of the body or the distance between the hands, and map it onto a value of a proxy character's form and transformation or effects and materials channel, such as energy, size or colour, without code.
- The motion value is turned into the character value with the same settings as a signal mapping: input range, output range, curve, smoothing and limits (story-live-signals-map-a-signal). Unlike a signal, the input is a performer's capture, so it drives a character only once that performer's agreement is confirmed (story-session-recording-record-agreement).
- A parameter mapping is a mapping asset and follows the rules in story-shared-characters-map-a-different-body. During rehearsal in production mode, Sam can change it and see the result with no new build or restart. The change is a new version, which runs in show mode only once approved.
- Driven by the portable inertial suit, the character value changes within the show's delay target (story-live-puppet-measure-delay).
- If the capture drops, the value uses its fallback (story-handover-and-fallback-define-fallback).
