---
id: story-interaction-design-scripted-tests
status: approved
derived-from:
  - epic-interaction-design#outcome: 6512961c0025
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Run a scripted test of each interaction on each target

As Sam, the technical artist, I want a scripted test of each interaction to run on each target with the automatic checks so that I can see why a check failed and fix the cause once for every project.

## Acceptance criteria

- Each interaction in the design (story-interaction-design-record-design) has a scripted scenario: the input for each target, played as simulated input, and the response the design expects. An agent can draft a scenario, and the person who holds the interaction designer's role confirms it.
- The scenarios run as part of the automatic checks on each target the show uses, in the Unreal Editor and on the target's test device named in its budget file (story-asset-checks-check-against-budget). They also run against delivered builds as part of the build's automatic checks (story-build-and-install-automatic-checks) once that story is built.
- A failed scenario shows the interaction, the target, the step that failed, what was expected and what happened, in plain text.
- The scenarios also run in show mode with every agent and the internet disconnected, and pass there.
- A passing run does not count as trying the interaction with new guests, which is a separate step, like a rehearsal. The check report says so.
