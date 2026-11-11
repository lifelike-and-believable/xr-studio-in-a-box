---
id: story-interaction-design-playable-prototype
status: approved
derived-from:
  - epic-interaction-design#outcome: 6512961c0025
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Try an interaction in a playable prototype

As Quinn, the interaction designer, I want to try an interaction in a playable prototype with placeholder art so that I can try it before final assets exist.

## Acceptance criteria

- Quinn can have a playable prototype of an interaction from the design (story-interaction-design-record-design) built with placeholder art, such as grey boxes and proxy characters on the UE5 mannequin skeleton (Manny), by working in Blueprint or by directing an agent, with no C++ or command line.
- Quinn can play the prototype in the Unreal Editor and on a test device the project names, such as a PC VR headset. A delivered build is not needed.
- A prototype build does not wait at any gate.
- Quinn or a reviewer can write feedback on a prototype, and the revised prototype comes back as a new version, with earlier versions kept (story-review-and-status-feedback-and-versions).
- Placeholder art an agent generates goes through the policy gate (story-provenance-and-policy-block-generation), the spend limit (story-agent-work-spend-limit), a tool adapter (story-agent-work-tool-adapter), the provenance record (story-provenance-and-policy-provenance-record) and the quality and licence gate (story-provenance-and-policy-quality-and-licence-gate).
- The project records the time from an interaction's brief to its first playable prototype, so a target can be set after the first project's baseline.
