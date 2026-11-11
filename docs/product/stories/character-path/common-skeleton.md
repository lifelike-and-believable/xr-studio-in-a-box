---
id: story-character-path-common-skeleton
status: approved
derived-from:
  - epic-character-path#outcome: ea093b262bb3
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Put a character on the common skeleton or retarget it

As Sam, the technical artist, I want each new humanoid character on the common skeleton or retargeted to it automatically so that I set up rigs and retargeting once instead of per capture source.

## Acceptance criteria

- A humanoid character from the path, including a rig from Tripo, is either on the UE5 mannequin skeleton (Manny) or retargeted to it automatically with IK Retargeter. Sam sees in text which applies, and which bones were not matched.
- Sam can correct a retarget without code. The retarget is saved and versioned with the character, and is reviewed with it at the mesh and rig gate (story-character-path-mesh-and-rig). An agent can draft a retarget but cannot approve it.
- Any supported source through the common interface (story-live-puppet-connect-a-source) drives the character with no hand-rigging per source. It is tested with recorded takes from the portable inertial suit and from one other source, with no change to the character.
- A character the retarget cannot match, such as a creature with a different body, is flagged in text and sent to a mapping (story-shared-characters-map-a-different-body) or the nearest body plan (story-nearest-body-retargeting-match-nearest-body-plan). It is not forced onto the skeleton.
- Driven by the live portable inertial suit, the retargeted character stays within the show's delay target (story-live-puppet-measure-delay). A live performer drives it only once their agreement is confirmed (story-session-recording-record-agreement).
