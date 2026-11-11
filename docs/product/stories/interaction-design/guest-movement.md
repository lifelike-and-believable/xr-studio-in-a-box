---
id: story-interaction-design-guest-movement
status: approved
derived-from:
  - epic-interaction-design#outcome: 6512961c0025
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Declare how guests move on each target

As Quinn, the interaction designer, I want to declare how guests move on each target so that how they move is in a form others can review.

## Acceptance criteria

- For each target the show uses, Quinn can choose how guests move, without code: physically, by teleport, by smooth movement, or guided or seated. The choice is part of the interaction design (story-interaction-design-record-design) and goes through its gate.
- The choices are checked against the comfort options the show declares (REQ-audience-12), such as a seated option and a low-motion option. Where a declared option has no supporting movement on a target, such as a low-motion option on a target that offers only smooth movement, Quinn and the reviewer see it in text, and the design cannot be sent to its gate until every declared option is supported on every target.
- The show's comfort options are those of story-guest-care-access-options. Until that story is built, the director or their delegate lists them in the project for this check. An agent cannot change the list.
- Quinn can try each chosen movement in the prototype (story-interaction-design-playable-prototype), in the Unreal Editor or on the target's test device named in its budget file (story-asset-checks-check-against-budget).
