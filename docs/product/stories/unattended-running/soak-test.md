---
id: story-unattended-running-soak-test
status: approved
derived-from:
  - epic-unattended-running#outcome: d435481b65a1
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Run a soak test before a long run

As Sam, the technical artist, I want to run a soak test before a long run so that I know the show keeps running when agents, the internet and staff are gone.

## Acceptance criteria

- The soak test runs the show continuously in show mode as it will run: on its schedule (story-unattended-running-schedule-and-check), through the idle state, and through sessions with simulated guests (story-live-signals-guest-presence) that take every path (story-branching-shows-paths-and-endings), with every agent and the internet disconnected.
- It runs for at least the show's longest day of scheduled opening hours multiplied by a factor that the producer sets, starting at two and never below two, counted in scheduled opening hours, not clock time. Only the producer can set or change the factor. An agent cannot.
- During the test, at least one crash and one power cut are forced, and the show recovers to the idle state each time (story-unattended-running-restart-and-recover).
- The result shows every failure, restart and alert, and the frame rate and memory over time against the target's budget file (story-asset-checks-check-against-budget). The test passes when every failure recovers, and the frame rate and memory stay within the budget for the whole run.
- In Layer 4 the test runs on the budget file's test device with the show run from the Unreal Editor as a standalone game. Once story-build-and-install-build-from-stages and story-build-and-install-install-and-roll-back are built, the test also runs on a delivered build installed on the show's own machine.
- The result goes to the build for a public show gate (story-build-and-install-automatic-checks), where it waits for the person named for that gate (story-review-and-status-hold-gated-hand-off). An agent cannot accept it. The first public unattended run cannot start until a passing soak test of the current show version is accepted.
