---
id: story-build-and-install-engine-and-plugin-versions
status: approved
derived-from:
  - epic-build-and-install#outcome: ac937a2b0f34
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Record engine and plugin versions, and show differences between targets

As Sam, the technical artist, I want every build to record its engine and plugin versions, with pinned plugin versions per target and differences shown before a build, so that I can keep engine and plugin versions under control across targets.

## Acceptance criteria

- Every first-release target builds on Unreal Engine 5.8 or newer. The project moves to 5.9 once it is stable: Sam proposes the move and the director or their delegate approves it. Each plugin's version is pinned for each target in the project. A build uses only the pinned versions, and fails with a message in plain words if one is missing.
- Each delivered build (story-build-and-install-build-from-stages) records the engine version and each plugin's version it uses, for each target (REQ-delivery-7). The record is shown with the build on the status board and at the build for a public show gate (story-build-and-install-automatic-checks).
- Where targets use different engine or plugin versions, the project shows the differences side by side, in text, before any build starts, so they are not found at build time.
- Only Sam, or another person with the technical artist's role, can change a pinned version, in production mode (story-show-safety-switch-modes). Each change is dated and logged with who made it. An agent can draft a change but cannot make it.
- A target is covered by the engine and its plugins when its delivered build passes the automatic checks (story-build-and-install-automatic-checks) on its test device named in its budget file (story-asset-checks-check-against-budget), with the engine and plugin versions recorded. Every first-release target is checked this way before the first public show. Standalone headsets are later (REQ-delivery-9), so a plugin for them is checked when they are added.
- A move to a new engine version or plugin version is a change that rebuilds and checks every target again. Until each target's new build is tested and accepted at the build for a public show gate, public shows use the last accepted build.
