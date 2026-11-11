---
id: story-audience-avatars-stream-viewer-crowd
status: approved
derived-from:
  - epic-audience-avatars#outcome: 5457b095ba74
  - persona-audience-member#goals: e1b5f3ebc15b
---

# Show stream viewers in the world as a simulated crowd

As Jamie, the audience member, I want stream viewers shown in the world as a crowd that responds to our combined reaction so that I feel present in the performance and am seen as part of it, even from the stream.

## Acceptance criteria

- A show can represent its stream viewers in the world as a simulated crowd (REQ-audience-4, REQ-characters-1). The director or their delegate chooses, in production mode, whether it does, where the crowd stands and its size range. An agent can draft these but cannot set them.
- The crowd is driven by the stream viewers' combined reaction through a signal mapping (story-live-signals-audience-reaction, story-live-signals-map-a-signal). No crowd member stands for or follows a single viewer, and nothing about a viewer is stored.
- The time from a change in the combined reaction to the crowd's response on the stream, as a viewer receives it (story-outputs-and-streaming-stream-to-platforms), is measured and shown, with the stream's own delay shown separately.
- If the reaction feed drops (story-outputs-and-streaming-read-chat, story-handover-and-fallback-automatic-switch), the crowd uses its fallback (story-handover-and-fallback-define-fallback), and Alex is told in plain words and by a sound.
- The crowd is placed as story-crowds-and-creatures-place-a-crowd says. Until that story is built, a placeholder crowd of proxy characters on the common skeleton with simple reactions, such as cheering, stands in. The crowd at its largest size fits the budget file of each target that shows it (story-asset-checks-check-against-budget).
- The story is tested with simulated stream viewers at the show's stream viewer count (story-audience-avatars-choose-an-avatar), with recorded or simulated chat and reactions, on a private stream only the crew can see.
