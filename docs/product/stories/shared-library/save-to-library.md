---
id: story-shared-library-save-to-library
status: approved
derived-from:
  - epic-shared-library#outcome: 0f9866061bcc
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Save an item to the organisation's library

As Sam, the technical artist, I want to save an approved character, rig, mapping, environment, interaction pattern or cue structure to the shared library, with its provenance and terms, so that the rigs, retargeting and capture mappings I set up once are there for every later project.

## Acceptance criteria

- Each project belongs to one organisation, and the project shows which. Each organisation has one shared library, used by all of its projects. This story defines the organisation and its library. Other stories refer to them by this story's id.
- Sam, or another person with the technical artist's role, can save an approved character, rig, mapping asset (story-shared-characters-map-a-different-body), environment or cue list (story-cue-list-build-a-cue-list) from a project to the library. A person who holds the interaction designer's role can save an interaction pattern (story-interaction-design-reusable-pattern). An item that has not been approved at its gate cannot be saved. An agent can propose a save, but only a person with the role can make it.
- A saved item carries its provenance record (story-provenance-and-policy-provenance-record), the terms of the original project that cover it, with their end dates and any sign-off they call for (story-provenance-and-policy-record-terms), and the performer agreements its parts derive from (story-session-recording-record-agreement). Prompts and reference inputs stay visible only to people whose role allows it.
- A saved item is a versioned copy. Later changes in the original project do not change it. Saving again makes a new version with a dated history, and earlier versions are kept.
- Each save appears in the activity log (story-agent-work-read-activity-log), naming who saved what, from which project, and at which version.
