---
id: story-session-operations-output-thumbnails
status: approved
derived-from:
  - epic-session-operations#outcome: 99fd6b992ac3
  - persona-venue-attendant#goals: ee33f70fd41e
---

# See a thumbnail of every output

As Taylor, the venue attendant, I want a wall of small thumbnails, one for each output, so that I can tell in plain language whether the system is ready, and spot a dark output before a guest notices it.

## Acceptance criteria

- Taylor and Alex can see a wall of small thumbnails, one for each output the show uses, each named in plain words, such as "Headset 3" or "Left screen".
- An output is dark when its picture is black or does not change for longer than a time the show's operator sets. A dark output is marked in text, not by colour alone, and announced with a sound, with what to do next in plain words.
- The delay from an output to its thumbnail is measured and shown.
- Only people whose role needs the wall, such as Taylor, Alex and the crew, can open it. It is never recorded and reaches no audience output.
- The wall works with every agent and the internet disconnected.
- Until outputs arrive in Layer 5 (epic-outputs-and-streaming), the story is tested in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with its window and simulated outputs, each made dark in turn. The full output monitor (REQ-showcontrol-17) is later.
