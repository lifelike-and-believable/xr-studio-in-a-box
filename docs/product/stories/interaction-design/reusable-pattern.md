---
id: story-interaction-design-reusable-pattern
status: approved
derived-from:
  - epic-interaction-design#outcome: 6512961c0025
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Save and configure a reusable interaction pattern

As Quinn, the interaction designer, I want to save an interaction as a pattern and configure it in a new project without code so that I can reuse proven interaction patterns from earlier projects rather than rebuild them.

## Acceptance criteria

- Quinn can save an interaction accepted at the interaction design gate as a pattern, with its design, input mappings (story-interaction-design-input-per-target) and settings, to the organisation's shared library (story-shared-library-save-to-library), which keeps its provenance and terms.
- Quinn can bring a pattern into another project and change its settings in the Unreal Editor, such as which objects or cameras it uses and its timing, without code. The configured pattern is part of that project's interaction design and goes through its gate (story-interaction-design-record-design).
- The first pattern is one the first show (UC-2) needs: a guest's presence or a performer's action triggers a response in the world. It is tested in the Unreal Editor with a simulated guest (story-live-signals-guest-presence) and a recorded performer take (story-session-recording-record-and-replay). Viewpoint choice comes later (REQ-audience-7).
- An agent can draft a pattern's settings, but only a person who holds the interaction designer's role can save a pattern to the library.
- Further patterns, such as grabbing, using and following a guide, are saved once two shows need the same interaction.
