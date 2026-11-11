---
id: story-shared-characters-intent-and-procedural-motion
status: approved
derived-from:
  - epic-shared-characters#outcome: 78501c6baddc
  - persona-performer#goals: 9de25c7bbe59
---

# Drive a character by position and intent

As Kai, the performer, I want to drive a character's position and intent while procedural motion fills in its body so that I can drive a body very different from my own.

## Acceptance criteria

- Kai drives a proxy character's world position and travel, and its intent, such as heading, speed or a chosen action, and procedural motion moves the rest of its body.
- Sam, the technical artist, chooses which channels Kai drives and which are procedural, and saves the choice as a mapping (story-shared-characters-map-a-different-body).
- The channels Kai drives respond within the delay target (story-live-puppet-measure-delay).
- Procedural motion runs without an agent. It follows Kai's input deterministically, so it is not show-time AI and is not an AI-filled channel (story-crowds-and-creatures-ai-assists). Only channels filled by a method that chooses its own action are AI-filled, and they are not in this story.
