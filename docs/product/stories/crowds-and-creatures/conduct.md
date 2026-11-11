---
id: story-crowds-and-creatures-conduct
status: approved
derived-from:
  - epic-crowds-and-creatures#outcome: 07b3a730e1a2
  - persona-performer#goals: 9de25c7bbe59
---

# Conduct a crowd or creatures as one instrument

As Kai, the performer, I want to conduct a whole crowd or group of creatures with my body or a device so that I can conduct a crowd while performing.

## Acceptance criteria

- Conducting is driving the shared values of a whole crowd (story-crowds-and-creatures-place-a-crowd) or group of creatures (story-crowds-and-creatures-add-creatures) from one performer's input, such as where it gathers, which way it moves, how fast and how spread out. Each member keeps its own rule-based variation within those values. Sam, or another person with the technical artist's role, sets which of Kai's gestures, controller, tracked prop (story-shared-characters-tracked-prop) or device drives which shared value through a signal mapping (story-live-signals-map-a-signal), in production mode. This story defines conducting. Other stories refer to it by this story's id.
- Kai takes and releases conducting through performer-fired cues (story-cue-list-performer-fired), so conducting is possible only in the sections the cue list arms for it. Kai perceives taking and releasing in at least two senses, such as touch and sound, with patterns distinct from the performer signal (story-handover-and-fallback-performer-signal) and from Kai's other cues. Kai conducts only once their agreement allows driving a character live (story-session-recording-record-agreement).
- The shared values Kai drives respond within the show's delay target (story-live-puppet-measure-delay). The time until the whole crowd or group visibly follows is measured and shown on its own.
- If Kai's input drops (story-handover-and-fallback-automatic-switch), or Kai releases conducting, the crowd or group returns to its own behaviours with no visible jump (story-handover-and-fallback-hand-over-a-channel), and on a drop Kai gets the performer signal.
- In show mode, only Kai, or a person at the show whose role allows it, can arm or release conducting, and an agent cannot.
- The story is tested with recorded performer takes (story-session-recording-record-and-replay) driving a proxy crowd and a group of proxy creatures, then with a real performer in rehearsal. The performer and the director or their delegate set the bar for how well the crowd follows before the story is accepted.
