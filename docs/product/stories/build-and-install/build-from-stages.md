---
id: story-build-and-install-build-from-stages
status: approved
derived-from:
  - epic-build-and-install#outcome: ac937a2b0f34
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Build a show from its approved stages

As Sam, the technical artist, I want a show built from its approved stages into a delivered build for each target, with each stage's output stored and reviewable, so that I can see why a build failed and fix the cause once for every project.

## Acceptance criteria

- A delivered build is a packaged, versioned build of one version of the show for one first-release target (REQ-delivery-1). It runs on its own on the target's machine, with no Unreal Editor, no agent and no internet. Its version names the show version, the target and the date it was made. This story defines a delivered build. Other stories refer to it by this story's id.
- The show is authored once. Each target's build packages the same show version, with that target's lower-detail versions (story-asset-checks-lower-detail-versions), and nothing is remade by hand for one target (REQ-delivery-2). A build for a public show contains only approved versions of every item. A build for rehearsal may also contain unapproved versions that Sam chooses, and each of them is listed in the build record and marked in text.
- Each stage of a build, such as gathering the approved versions, preparing content, packaging and the automatic checks (story-build-and-install-automatic-checks), stores its output and log under the build's version. Sam, Jordan and other people whose role needs it can open them from the status board (story-review-and-status-status-board). Earlier builds are kept and can be compared side by side (story-review-and-status-feedback-and-versions).
- A failed build stops at the stage that failed. It names the stage, the item, the target and the cause in plain words, and links to the log. Sam can change a build step without modifying the core (story-agent-work-extend-the-workflow), and every project that uses that version of the step gets the change.
- Sam, another person with the technical artist's role, or an agent they direct in production mode (story-show-safety-switch-modes) can start a build. Starting a build changes no approved item.
- The story is tested by building a proxy level for each first-release target the project uses and running each delivered build on that target's test device named in its budget file (story-asset-checks-check-against-budget), and by making one stage fail in turn.
