---
id: story-interaction-design-input-per-target
status: approved
derived-from:
  - epic-interaction-design#outcome: 6512961c0025
  - persona-interaction-designer#goals: 59b8371fa6c9
---

# Map an interaction to each target's input

As Quinn, the interaction designer, I want to map one interaction to each target's input and say what replaces it where a target cannot support it so that I can design an interaction once and see how it maps to each target's input.

## Acceptance criteria

- Quinn can map an interaction to each input a target uses, without code: hand tracking, controllers, mouse and keyboard, and touch.
- Where a target cannot support an interaction, Quinn records what replaces it there, or that it is not offered there.
- Quinn sees one table of every interaction against every target the show uses, with its mapping or replacement. A target with neither is marked as unmapped in text, and the design cannot be sent to its gate while any target is unmapped.
- Quinn can try each mapping in the prototype (story-interaction-design-playable-prototype) with that target's input simulated in the Unreal Editor, or on a test device the project names.
- A mapped interaction keeps working in show mode with every agent and the internet disconnected.
