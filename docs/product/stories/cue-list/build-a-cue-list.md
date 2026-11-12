---
id: story-cue-list-build-a-cue-list
status: approved
derived-from:
  - epic-cue-list#outcome: 26d12b7b12dc
  - persona-show-operator#goals: 408315e4f8f6
---

# Build and edit a cue list in Unreal

As Alex, the show operator, I want to build and edit a cue list in Unreal whose cues act on scenes, lighting, sound, characters, cameras and outputs so that I can run a show from a cue list.

## Acceptance criteria

- Alex can build and edit a show's cue list without code, from the operator's touchscreen or tablet surface (story-external-systems-surfaces-and-standalone) as well as in the Unreal Editor, and needs no Unreal skills to do it. Sam can build the first version in the editor for Alex to review. The cue list is part of the Unreal project, is versioned with it (story-review-and-status-feedback-and-versions), and runs with the show on the show machine with no extra machine, no agent and no internet. It can take cues from outside, such as OSC, MIDI show control or timecode, through epic-external-systems.
- A cue is a named, numbered step that sets one or more targets: a scene, lighting, sound, a character (including a transition, story-character-forms-morph, and a set handover, story-handover-and-fallback-hand-over-a-channel), a camera, or an audience-facing output. The cue list is the show's ordered set of cues. Firing a cue is the moment it starts to act on all of its targets. A section is a named run of cues in the list, such as a scene or an act. This story defines cue, cue list, firing a cue and section. Other stories refer to them by this story's id.
- Each cue states the ways it may be fired: stepped in order or from the palette (story-cue-list-step-and-palette), by a performer (story-cue-list-performer-fired), from timecode or a music track (story-cue-list-timecode-and-music), by the audience (story-cue-list-audience-fired), or by an external system (story-external-systems-osc-midi-msc). A cue may allow more than one.
- Alex, or another person whose role allows it, edits the cue list in production mode (story-show-safety-switch-modes). In show mode, a change to the cue list is a change during a live run and follows its rules (story-session-operations-live-changes). An agent cannot change the cue list in show mode.
- A version of the cue list runs in a public show only once the director or their delegate accepts it at the cue list gate (story-review-and-status-hold-gated-hand-off). Any version can run in rehearsal. The show tells Alex in text which version is running and whether it is accepted.
- The story is tested in the Unreal Editor, with the show run as a standalone game on the test device named in the budget file (story-asset-checks-check-against-budget), with one cue for each kind of target on a proxy level. Outputs (story-outputs-and-streaming-pc-vr, story-outputs-and-streaming-projector-or-screen, story-outputs-and-streaming-stream-to-platforms) are tested with a simulated output until those stories are built.
