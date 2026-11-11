---
id: story-show-safety-without-agents
status: approved
derived-from:
  - epic-show-safety#outcome: f4a6fa9d5258
  - persona-performer#goals: 9de25c7bbe59
---

# Keep every live function working when all agents are gone

As Kai, the performer, I want the show to keep running when every agent stops so that I can stay in character whatever happens.

## Acceptance criteria

- In show mode (story-show-safety-switch-modes), cues, routing and handovers, fallbacks, outputs, mixes, the performer signal, the crew channel and the emergency stop depend on no agent being available or responsive. A session can start in show mode with no agent running.
- A scripted test runs a test show in show mode from a recorded performer take (story-session-recording-record-and-replay), stops every agent and disconnects the internet part way through, and checks that the session carries on with no stop or restart, every cue fires within the show's cue timing (story-cue-list-step-and-palette), and every output keeps running.
- The same test is run once in rehearsal with Kai performing live, and Kai notices no change when the agents stop.
- When a service that needs the internet or reaches its spend limit (story-agent-work-spend-limit) stops in show mode, the show does not stop. The affected service switches to its fallback (story-handover-and-fallback-define-fallback), and Alex is told in text and with a sound. Only what reaches remote audiences, and a declared remote performer link (REQ-delivery-5), needs the internet.
- The scripted test runs as one of the automatic checks on every build for a public show, and its pass or fail is recorded with the build.
- The test runs in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget). The test also runs on every build for a public show as part of its automatic checks (story-build-and-install-automatic-checks). Remote outputs (story-outputs-and-streaming-stream-to-platforms) are simulated until that story is built.
