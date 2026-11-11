---
id: story-build-and-install-automatic-checks
status: approved
derived-from:
  - epic-build-and-install#outcome: ac937a2b0f34
  - persona-producer#goals: d1cc47b03be9
---

# Test each build automatically, and hold it at the public show gate

As Jordan, the producer, I want each build tested by the automatic checks and held at the build for a public show gate so that I know where each build stands, who it waits for, and what is blocking it.

## Acceptance criteria

- A tested build is a delivered build (story-build-and-install-build-from-stages) that, for every target the show uses, built successfully and passed the asset checks (story-asset-checks-check-against-budget, story-asset-checks-check-effects-and-audio, story-asset-checks-check-provenance), the scripted scenarios (story-interaction-design-scripted-tests, story-branching-shows-review-and-test-paths, story-show-safety-without-agents) the performance measurements (story-build-and-install-measure-against-budget), and a check that the build contacts no address outside the venue network for any in-venue function (story-venue-setup-offline-show). These are automatic checks only (REQ-workflow-1). A rehearsal with people is a separate step. This story defines a tested build. Other stories refer to it by this story's id.
- The checks run by themselves as part of every build, on the delivered build on each target's test device named in its budget file. The result shows pass or fail for each check and target in text, not by colour alone, with the build version.
- The build for a public show gate is the gate (REQ-workflow-2) a delivered build passes before it is used for any show with a public audience, including guests in the venue and a public stream. Only a tested build can go to it. It waits for the person named for the gate (story-project-record-name-approvers, story-review-and-status-hold-gated-hand-off), who sees the check results, the build record with its engine and plugin versions (story-build-and-install-engine-and-plugin-versions), any soak test result (story-unattended-running-soak-test), the offline test result at each venue (story-venue-setup-offline-show), and, for the show's first public show, whether the access review is recorded (story-guest-care-access-options). A build for the show's first public show cannot be accepted until the access review is recorded. A build is accepted once, and its acceptance for a venue may follow later, once that venue's offline test passes. An AI recommendation is marked as one and cannot pass the gate. An agent cannot accept a build. A build for rehearsal is not gated. This story defines the build for a public show gate. Other stories refer to it by this story's id.
- Jordan, and other people whose role needs it, see on the status board each build's state for each target, in text: building, failed at a named stage, tested, waiting at the gate with who it waits for, accepted or rejected.
- The story is tested on a proxy level by making each kind of check fail in turn, and checking that the build cannot go to the gate until every check passes, and that a build for the first public show cannot be accepted while the access review is not recorded.
