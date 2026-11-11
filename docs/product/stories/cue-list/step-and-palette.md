---
id: story-cue-list-step-and-palette
status: approved
derived-from:
  - epic-cue-list#outcome: 26d12b7b12dc
  - persona-show-operator#goals: 408315e4f8f6
---

# Step through a cue list, or fire cues from a palette

As Alex, the show operator, I want to step through the cue list in order, or fire cues from a free palette in any order, within the show's cue timing, so that I can run a show from a cue list, a free palette or a mix of these.

## Acceptance criteria

- Alex can fire the next cue in the list (story-cue-list-build-a-cue-list) with one go control. Before each go, Alex sees the name and number of the next cue and of the cue fired last.
- Alex can open a palette of the cues the show allows to be fired in any order, and fire any of them. Firing a palette cue does not change which cue is next in the list.
- A cue's timing error is the time between the moment it should fire (the go, a palette press, an incoming message or its time on a clock) and the moment its first target changes on an output. It is measured on the show's hardware with a test that records both moments. The show's cue timing starts at one frame at the show's frame rate (the frame rate in the target's budget file, story-asset-checks-check-against-budget). The director or their delegate confirms or changes it from rehearsal results before this story is accepted. An agent cannot set it. This story defines the show's cue timing. Other stories refer to it by this story's id.
- Each measurement is saved with its date, hardware and cue, and shows pass or fail against the show's cue timing in text, not by colour alone.
- If a cue fails to act on a target, Alex is told in plain words and by a sound, with the cue and the target named, and the show carries on with the next cue.
- Stepping and the palette work with every agent and the internet disconnected.
