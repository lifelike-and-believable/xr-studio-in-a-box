---
id: story-asset-checks-check-against-budget
status: approved
derived-from:
  - epic-asset-checks#outcome: 85507973a80b
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Check an asset against each target's budget before review

As Sam, the technical artist, I want every asset checked automatically for naming, polygon and texture budgets, rigs, textures and materials against one budget file per target so that I can see why a check failed and fix the cause once for every project.

## Acceptance criteria

- Each first-release target (REQ-delivery-1) has one budget file. It holds the target's frame rate, memory and load time (REQ-delivery-8), the limits for each asset type (such as polygons, texture size and memory, materials, bones, effect cost, and audio format and loudness), and the test device the target is checked on. This story defines the budget file. Other stories refer to it by this story's id.
- Only the director or their delegate can set or change a budget file. Each change makes a new dated version that names who made it. An agent can draft numbers but cannot set or change them. The first numbers are set from measurements on proxy assets (proxy characters on the common skeleton and a proxy environment) on each target's test device, before this story is accepted. In Layer 3, frame rate, memory and load time are measured on the test device with the proxy level run from the Unreal Editor as a standalone game, not a delivered build. Delivered builds are measured again in story-build-and-install-measure-against-budget.
- Before an asset goes to review, it is checked automatically for naming (against the naming rule Sam sets), polygons and textures against each target's budget file, rig validity (a valid skeleton, skin weights, and either the common skeleton or an approved mapping asset as in story-shared-characters-map-a-different-body), and texture and material validity (each file opens, uses an allowed format and compiles, and nothing is missing).
- An asset passes the asset checks for a target when the version of it used on that target passes every check that applies to its type against that target's current budget file. The result records the budget file version. When a budget file changes, the assets it covers are checked again. This story defines "passes the asset checks for a target". Other stories refer to it by this story's id.
- A failed check names the asset, the check, the target, the measured value and the limit, in plain words. Sam can see which version of the check made the decision.
- Sam can add or change a check without modifying the core (story-agent-work-extend-the-workflow), and every project that uses that version of the check gets the change.
