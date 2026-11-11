---
id: story-branching-shows-review-and-test-paths
status: approved
derived-from:
  - epic-branching-shows#outcome: fb606af20aad
  - persona-director#goals: a92ca172be83
---

# Review every path at the gate, and test each with a script

As Morgan, the director, I want every path of a show reviewed at the cue list gate with a passing scripted test so that I can take a brief to a running, tested show.

## Acceptance criteria

- Each path and ending (story-branching-shows-paths-and-endings) has a scripted test. It meets the conditions that lead down that path with simulated guest actions (story-live-signals-guest-presence), a simulated audience result, recorded performer takes (story-session-recording-record-and-replay) or elapsed time, and checks that the expected cues fire in order and the path reaches its rejoin or ending. Each branch point also has a test in which no condition is met and the default path is taken. An agent can draft a test, and the person who holds the interaction designer's role confirms it.
- The tests run as part of the automatic checks, in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), in show mode with every agent and the internet disconnected. They also run against delivered builds as part of the build's automatic checks (story-build-and-install-automatic-checks) once that story is built.
- A failed test names the path, the step that failed, what was expected and what happened, in plain text.
- At the cue list gate (story-cue-list-agent-drafts), Morgan sees every path and ending in the flat list, each with its latest test result and the date it was last rehearsed, if it has been. A path with no test, or with a failed test or one run on an earlier version, is marked in text, and the list cannot be accepted until every path passes on the current version.
- Each path can be rehearsed: Alex can run any path cue to cue by setting its conditions by hand (story-branching-shows-unreal-condition) or by jumping to a cue on it (story-session-operations-pause-and-jump).
- Morgan, or the person named for the cue list gate, accepts the list. An AI recommendation is marked as one and cannot pass the gate (story-review-and-status-hold-gated-hand-off).
