---
id: story-show-safety-declare-safe-state
status: approved
derived-from:
  - epic-show-safety#outcome: f4a6fa9d5258
  - persona-director#goals: a92ca172be83
---

# Declare a show's safe state for each kind of output

As Morgan, the director, I want each show to declare what every kind of output does in its safe state, approved by the person who holds the audience-facing safety and consent approval, so that this approval stays with a person and never goes to an AI.

## Acceptance criteria

- The safe state is what the show's outputs do after an emergency stop (story-show-safety-emergency-stop). The director or their delegate declares it for each kind of output the show uses: house lights come up, where the show controls them, to a level they set; headset guests see the real room, or a safe view where the headset cannot show the room; projection and screens show a safe view; sound and effects go to safe levels they set; remote viewers see a holding screen. Where an external system leads the show (story-external-systems-lead-or-follow), the safe state can also send a message the director or their delegate declares, such as a house-lights cue to the lighting desk (story-external-systems-osc-midi-msc). A safe view is a still, level scene with no flashing and a short plain-language message they set. This story defines the safe state and the safe view. Other stories refer to them by this story's id.
- A kind of output with nothing declared uses a default: house lights at full, the real room or a safe view in headsets, a safe view on projection and screens, sound faded to silence and effects off, and a holding screen for remote viewers. No output is left without a safe state.
- The person the project records as holding the audience-facing safety and consent approval (story-project-record-name-approvers) approves each show's safe state and each change to it. On a solo show this is the same holder, such as the producer, or the solo performer if they hold it. An agent can draft a safe state but cannot approve it.
- Before approving, the holder can put each output into its safe state in rehearsal and see and hear the result. The sound level of each output in its safe state is measured and shown beside the level that was set.
- The safe state can be changed only in production mode (story-show-safety-switch-modes), never during a session.
- The story is tested in the Unreal Editor, with the show run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget). House lights, and the message to a leading desk, are tested against a simulated lighting desk (story-external-systems-simulators), and headsets (story-outputs-and-streaming-pc-vr), projection (story-outputs-and-streaming-projector-or-screen) and remote outputs (story-outputs-and-streaming-stream-to-platforms) are simulated until those stories are built.
