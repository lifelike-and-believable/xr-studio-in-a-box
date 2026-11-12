---
id: story-session-operations-start-and-end-session
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-show-operator#goals: 408315e4f8f6
---

# Start and end a session, with its streams

As Alex, the show operator, I want one control to start a session, a clear rule for what ends it, and its stream destinations to start and stop with it as the show sets, so that I can run the show from a cue list, a free palette, timecode or any mix of these, from the first guest to the reset.

## Acceptance criteria

- A person whose role allows it, such as Alex or Taylor, opens the pre-show (story-guest-care-standard-pre-show) of a copy that is ready (story-session-operations-several-sessions), then starts the session with one start control. A show that runs one session at a time is one copy. The start is blocked, with the reason in plain words, while show mode does not allow a session with guests (story-show-safety-switch-modes). This story defines the start control and the end of a session. Other stories refer to them by this story's id.
- The director or their delegate sets, in production mode, what ends a session for the show: reaching an ending (story-branching-shows-paths-and-endings) or the last cue in the list, a person whose role allows it ending it with a confirmation, a time limit, or any mix of these. Before a time limit ends a session, Alex is told in text and with a sound at a warning time they set. The end then leads to the reset (story-session-operations-reset-for-next-session).
- The director or their delegate sets, for each stream destination (story-outputs-and-streaming-stream-to-platforms), whether it starts with the session's start or by hand, and whether it stops at the session's end or shows a holding screen between sessions. A public destination starts only within its going-live approval (story-outputs-and-streaming-approve-going-live), and ending a stream is never blocked.
- Alex sees each session's state (pre-show, running, ended, resetting) and each destination's state in text, not by colour alone, and is told with a sound when a session starts or ends. The session log records the start, the end and what ended it. In show mode an agent cannot start or end a session or start a destination.
- The story is tested in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated guests, a private stream that only the crew can see, and each way of ending a session in turn. Starting and ending work with every agent and the internet disconnected.
