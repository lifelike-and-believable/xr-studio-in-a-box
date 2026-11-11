---
id: story-environment-path-place-interactions
status: approved
derived-from:
  - epic-environment-path#outcome: 8f3b5393b456
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Place designed interactions in a level

As Quinn, the interaction designer, I want to place designed interactions in a level so that what a guest can do, and what responds to them, is in a form others can review.

## Acceptance criteria

- Quinn can place an interaction whose design was accepted at the interaction design gate (story-interaction-design-record-design) at a position in a level in the Unreal Editor, without code. Each placed interaction shows which design and version it comes from.
- Quinn can walk the level in the editor and try each placed interaction with a simulated guest. Interactions that fire cues use simulated cues until show control arrives in Layer 4.
- A change to a placement is a new version of the level, and the earlier one is kept (story-review-and-status-feedback-and-versions).
- An agent can draft a placement, but only a person who holds the interaction designer's role can confirm it. The director holds this role unless the project names someone else (story-project-record-name-approvers). A technical artist can be named for the build side.
- How each interaction maps to each target's input is covered by story-interaction-design-input-per-target, not by this story.
