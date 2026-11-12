---
id: story-build-and-install-soak-test-attended-show
status: approved
derived-from:
  - epic-build-and-install#outcome: ac937a2b0f34
  - persona-technical-artist#goals: 1fb2055dfdf2
---

# Soak-test an attended show before its first public day

As Sam, the technical artist, I want to run a delivered build through a whole show day and more before its first public day so that I see why it fails over a long run, such as a memory leak, and fix the cause before guests meet it.

## Acceptance criteria

- The soak test of an attended show runs the delivered build (story-build-and-install-build-from-stages), installed on the show's own machines (story-build-and-install-install-and-roll-back), in show mode, for at least its longest show day, from the first session's start to the last session's end, multiplied by a factor the producer sets, starting at one and a half and never below one. Only the producer can set or change the factor, and an agent cannot. A self-guided unattended show uses story-unattended-running-soak-test instead.
- The run repeats the day as it will run: the pre-show, sessions of the show's length with a reset between each (story-session-operations-reset-for-next-session), simulated guests in every audience type the show uses (story-remote-guests-join-by-link-or-code) taking every path (story-branching-shows-paths-and-endings), characters driven by recorded performer takes where each performer's agreement allows replay in tests (story-session-recording-record-agreement), and each stream destination as a private stream that only the crew can see (story-outputs-and-streaming-stream-to-platforms).
- The result shows, per machine, the frame rate and memory over the whole run against the target's budget file (story-asset-checks-check-against-budget), memory at each reset, and every failure, restart and dropped destination, in text. It passes when frame rate and memory stay within the budget for the whole run and memory after each reset stays within an amount Sam sets of its value after the first reset. An agent cannot set the amount.
- The result goes to the build for a public show gate (story-build-and-install-automatic-checks). A build cannot be accepted there for an attended public show until a passing soak test of that build is shown.
- The story is tested on the first release's test kit (story-build-and-install-measure-against-budget) with sessions and the run shortened to minutes, and with a build made to leak memory, which must fail.
