---
id: story-outputs-and-streaming-virtual-cameras
status: approved
derived-from:
  - epic-outputs-and-streaming#outcome: 6afddd5b3ae6
  - persona-show-operator#goals: 408315e4f8f6
---

# Set up virtual cameras and cut between them live

As Alex, the show operator, I want the show's virtual cameras set up in advance and a switcher to cut between them live, with a preview of the next shot, so that I can run the stream's pictures from a cue list, a free palette or any mix of these.

## Acceptance criteria

- Sam, or the director or their delegate, sets up a show's virtual cameras in production mode (story-show-safety-switch-modes) without code: each has a name, a placement and a lens, and may follow a character or a point with a smoothing they set. A camera channel (story-live-puppet-assign-channels) can drive a camera's position or values live, such as from a tracked handheld camera. An agent can draft camera placements but cannot change them in show mode, where a change is a change during a live run (story-session-operations-live-changes).
- Alex sees, on the operator console, the live picture of a view (story-outputs-and-streaming-stream-to-platforms) and a preview of the camera chosen next, and cuts or fades to it with one control. Each cut from the switcher is a palette cue (story-cue-list-step-and-palette), so it is logged, fires within the show's cue timing and does not change the next cue in the list. A cue in the list can also cut to a camera (story-cue-list-build-a-cue-list).
- The preview and the switcher are seen only by the operator and the crew named for the session, and reach no output. This is checked on every output connected in the test.
- If a followed character is hidden or removed, the camera holds its last framing and Alex is told in text and with a sound.
- The story is tested on a proxy level with three cameras, one following a proxy character driven by a recorded take, in the Unreal Editor with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with a private stream that only the crew can see. Cutting works with every agent and the internet disconnected.
