---
id: story-behaviour-and-limits-scenario-tests
status: approved
derived-from:
  - epic-behaviour-and-limits#outcome: 11fe519b4e30
  - persona-director#goals: a92ca172be83
---

# Test behaviour with recorded scenarios, and block a failing build

As Morgan, the director, I want autonomous behaviour tested by replaying recorded scenarios and judging the results statistically, with a failing build kept from a public show, so that I can take a brief to a running, tested show.

## Acceptance criteria

- A recorded scenario is a set of inputs replayed to the autonomous characters (story-behaviour-and-limits-write-specification): cues, signals, simulated guests (story-live-signals-guest-presence) and recorded performer takes (story-session-recording-record-and-replay) used only where each performer's agreement allows replay in tests (story-session-recording-record-agreement), with proxy motion otherwise. A scenario never holds recordings of real guests (REQ-governance-7). An agent can draft scenarios, and the director or their delegate confirms them. This story defines a recorded scenario and scenario checks. Other stories refer to them by this story's id.
- Each scenario is replayed a number of times the director or their delegate sets, and scenario checks judge the results across the runs. Any output outside the content limits (story-behaviour-and-limits-content-limits), in any run of any scenario, fails the build. Every other check, such as a reaction to a cue named in the specification, passes when it succeeds in at least the share of runs the director or their delegate sets for each show from rehearsal, starting at 95 per cent. An agent cannot set or change a run count or rate.
- The scenarios run as part of every build's automatic checks (story-build-and-install-automatic-checks), on each target's test device (story-asset-checks-check-against-budget), and once more in show mode with every agent and the internet disconnected. A build that fails a scenario check is not a tested build, so it cannot go to the build for a public show gate.
- The result shows each scenario, check, number of runs, the rate reached and the rate required, and each limit breach with its run, time and character, with pass or fail in text, not by colour alone. Morgan, the gate's approver and others whose role needs it see it.
- The story is tested with proxy characters made to break a limit in one run only, which fails the build, and made to fall below a set rate, which also fails it.
