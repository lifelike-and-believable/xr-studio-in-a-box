---
id: story-branching-shows-self-guided-run
status: approved
derived-from:
  - epic-branching-shows#outcome: fb606af20aad
  - persona-director#goals: a92ca172be83
---

# Run a show as a self-guided experience

As Morgan, the director, I want to run the same authored show as a self-guided experience, with no performers and no operator, so that I can take a brief to a running show without rebuilding it for a new format.

## Acceptance criteria

- The director or their delegate can declare a show self-guided. It keeps the same project, cue list and build path as a live show, with no separate workflow. An agent cannot make or change the declaration. This story defines a self-guided show: a show that runs with no performer and no operator. Other stories refer to it by this story's id.
- In a self-guided show, cues fire only from guest actions or combined audience results (story-cue-list-audience-fired), conditions (story-branching-shows-conditional-cue) or timecode (story-cue-list-timecode-and-music). When the director or their delegate declares the show, any cue that needs an operator or a performer to fire it is listed in plain text, and the declaration is refused until each has another way to fire.
- No cue can wait forever: with nobody to fire or skip a cue by hand, each condition's time limit and default always apply.
- Characters are driven by recordings (story-session-recording-record-and-replay). A recording of a performer stands in only if that performer's agreement allows standing in (story-session-recording-record-agreement); otherwise the declaration is refused and the director is told which agreement blocks it. Autonomous characters (story-crowds-and-creatures-place-a-crowd, story-crowds-and-creatures-add-creatures) can also drive characters, under an accepted behaviour specification (story-behaviour-and-limits-write-specification) with its scripted fallback (story-behaviour-and-limits-scripted-fallback); until those stories are built, characters are driven by recordings only.
- A self-guided show cannot be declared without the safety controls in story-branching-shows-self-guided-safety. It runs in show mode with every agent and the internet disconnected.
- The story is tested in the Unreal Editor run as a standalone game on the budget file's test device (story-asset-checks-check-against-budget), with simulated guests, from the start to every ending. Running as an app or installation on the delivery targets is tested once story-build-and-install-build-from-stages and story-build-and-install-install-and-roll-back are built.
