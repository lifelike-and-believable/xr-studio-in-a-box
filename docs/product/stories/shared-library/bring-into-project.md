---
id: story-shared-library-bring-into-project
status: approved
derived-from:
  - epic-shared-library#outcome: 0f9866061bcc
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Bring a library item into a new project

As Sam, the technical artist, I want to bring a character, rig, mapping, environment or cue structure from the library into a new project so that I can set up rigs and mappings for the new project from work already done, instead of building them again.

## Acceptance criteria

- From a project, Sam, or another person whose role allows it, can choose an item and version from the organisation's library (story-shared-library-save-to-library) and bring it in. The terms check (story-shared-library-check-terms) runs first, and the item comes in only if the check allows it. An agent can propose bringing an item in, but only a person with the role can do it.
- The copy in the new project keeps its provenance record, with a new entry naming the library item and version, the original project, the new project, who brought it in and when.
- In the new project, the item is checked against that project's targets (story-asset-checks-check-against-budget) and waits at its gate for the new project's named approver, like other work at that hand-off (story-review-and-status-hold-gated-hand-off). A mapping asset follows the rules in story-shared-characters-map-a-different-body, and runs in show mode only once it is approved in the new project.
- Changes in the new project make new versions there, and do not change the library item. A newer library version does not change the project's copy until a person brings it in again.
- The project lists which of its items came from the library, and from which version.
